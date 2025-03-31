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
    let locationSubscription;

    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Fetch initial location
      let loc = await fetchLocation();
      if (loc) {
        updateLocation(loc);
      }

      // Start periodic updates
      locationSubscription = setInterval(async () => {
        let newLoc = await fetchLocation();
        if (newLoc) {
          updateLocation(newLoc);
        }
      }, 30 * 1000); // Updates every 30 seconds

      return () => clearInterval(locationSubscription);
    })();

    return () => clearInterval(locationSubscription);
  }, []);

  async function fetchLocation() {
    try {
      return await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  }

  function updateLocation(loc) {
    setLocation(loc);

    // Pass location to parent (if provided)
    onLocationUpdate?.(loc.coords);

    // Send location to API or fallback to SMS
    sendLocation(loc);

    // Show toast notification
    Toast.show({
      type: "info",
      text1: "Location Updated",
      text2: "Location sent successfully!",
    });
  }

  async function sendLocation(loc) {
    const { isConnected } = await NetInfo.fetch();

    if (isConnected) {
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
          console.warn("Failed to send location. Retrying...");
          retrySendLocation(loc);
        }
      } catch (error) {
        console.error("Network error:", error);
        retrySendLocation(loc);
      }
    } else {
      await sendLocationViaSMS(loc);
    }
  }

  async function sendLocationViaSMS(loc) {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        ["07586054088"],
        `Location: ${loc.coords.latitude}, ${loc.coords.longitude}, Time: ${new Date()}`
      );
    } else {
      console.warn("SMS not available. Unable to send location.");
    }
  }

  function retrySendLocation(loc) {
    Toast.show({
      type: "warning",
      text1: "Retrying...",
      text2: "Attempting to resend location in 3 minutes",
    });

    setTimeout(() => sendLocation(loc), 3 * 60 * 1000); // Retry in 3 minutes
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {errorMsg || "Tracking location..."}
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
