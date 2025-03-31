import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import LocationTracker from "../components/LocationTracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Compass from "../components/Compass";

export default function TrekScreen() {
  // Get the trek name from the URL parameters
  const { name } = useLocalSearchParams();

  // State to store the user's recorded route
  const [route, setRoute] = useState([]);

  // Function to update route when a new location comes in
  const handleLocationUpdate = (newCoords) => {
    setRoute((prevRoute) => [...prevRoute, newCoords]);
  };

  // Function to save the trek data to AsyncStorage
  const saveTrek = async () => {
    try {
      const trekData = { name, route };
      const existingTreks = await AsyncStorage.getItem("treks");
      const treks = existingTreks ? JSON.parse(existingTreks) : [];

      // Update the existing trek if found, otherwise keep it unchanged
      const updatedTreks = treks.map((trek) =>
        trek.name === name ? { ...trek, route } : trek
      );

      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
      alert("Trek saved successfully!");
    } catch (error) {
      console.error("Error saving trek:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Display the trek name */}
          <Text style={styles.title}>Trek Name:</Text>
          <Text style={styles.trekName}>{name}</Text>

          {/* Map container to display the trek route */}
          <View style={styles.mapContainer}>
            {route.length > 0 ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: route[0].latitude,
                  longitude: route[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                provider="google"
                mapType="hybrid"
              >
                {/* Start marker */}
                <Marker coordinate={route[0]} title="Start" />

                {/* Polyline to show the route */}
                <Polyline
                  coordinates={route}
                  strokeWidth={5}
                  strokeColor="blue"
                />

                {/* Marker for the last known position */}
                {route.length > 1 && (
                  <Marker coordinate={route[route.length - 1]} title="You" />
                )}
              </MapView>
            ) : (
              <Text style={styles.loadingText}>Waiting for location...</Text>
            )}
          </View>

          {/* Compass component */}
          <View style={styles.compassContainer}>
            <Compass />
          </View>

          {/* Location tracker to update user position */}
          <LocationTracker onLocationUpdate={handleLocationUpdate} />

          {/* Display list of recorded coordinates */}
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Recorded Coordinates:</Text>
            <FlatList
              data={route}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Text style={styles.coordinateItem}>
                  {index + 1}: Lat {item.latitude}, Lng {item.longitude}
                </Text>
              )}
              nestedScrollEnabled={true}
            />
          </View>

          {/* Save trek button */}
          <TouchableOpacity onPress={saveTrek} style={styles.savebutton}>
            <Text style={{ color: "white", textAlign: "center" }}>
              Save Trek
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#2e7d32",
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trekName: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    height: 300,
    width: 300,
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  listContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    width: "100%",
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coordinateItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  savebutton: {
    backgroundColor: "#0288D1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    marginBottom: 20,
  },

  compassContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "black",
    height: 200,
    width: 200,
  },
});
