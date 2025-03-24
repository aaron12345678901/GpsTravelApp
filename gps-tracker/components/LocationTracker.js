import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import * as SMS from "expo-sms";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

export default function LocationTracker({ onLocationUpdate }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      sendLocation(loc);

      // Pass initial location to parent
      onLocationUpdate && onLocationUpdate(loc.coords);

      const interval = setInterval(async () => {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        sendLocation(loc);

        // Send updates to TrekScreen
        onLocationUpdate && onLocationUpdate(loc.coords);

        Toast.show({
          type: "info",
          text1: "Location Update",
          text2: "Location sent successfully",
        });
      }, 0.5 * 60 * 1000);

      return () => clearInterval(interval);
    })();
  }, []);

  async function sendLocation(loc) {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      try {
        let response = await fetch(
          "https://travelapp-nu.vercel.app/api/location",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              timestamp: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          retrySendLocation(loc);
        }
      } catch (error) {
        retrySendLocation(loc);
      }
    } else {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(
          ["07586054088"],
          `Location: ${loc.coords.latitude}, ${
            loc.coords.longitude
          }, Time: ${new Date()}`
        );
      }
    }
  }

  function retrySendLocation(loc) {
    Toast.show({
      type: "warning",
      text1: "Retrying...",
      text2: "Attempting to resend location in 3 minutes",
    });

    setTimeout(() => sendLocation(loc), 3 * 60 * 1000);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {errorMsg ? errorMsg : "Current location..."}
      </Text>
      {location && (
        <>
          <Text style={styles.coords}>
            Latitude: {location.coords.latitude}
          </Text>
          <Text style={styles.coords}>
            Longitude: {location.coords.longitude}
          </Text>
        </>
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2e7d32",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    height: 200,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coords: {
    color: "white",
    fontSize: 16,
  },
});
