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

export default function TrekScreen() {
  const { name } = useLocalSearchParams();
  const [route, setRoute] = useState([]);

  // Function to update route when a new location comes in
  const handleLocationUpdate = (newCoords) => {
    setRoute((prevRoute) => [...prevRoute, newCoords]);
  };

  const saveTrek = async () => {
    try {
      const trekData = { name, route };
      const existingTreks = await AsyncStorage.getItem("treks");
      const treks = existingTreks ? JSON.parse(existingTreks) : [];
      treks.push(trekData);
      await AsyncStorage.setItem("treks", JSON.stringify(treks));
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
          <Text style={styles.title}>Trek Name:</Text>
          <Text style={styles.trekName}>{name}</Text>

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
              >
                {/* Start marker */}
                <Marker coordinate={route[0]} title="Start" />

                {/* Polyline to show the route */}
                <Polyline
                  coordinates={route}
                  strokeWidth={5}
                  strokeColor="blue"
                />

                {/* Last known position */}
                {route.length > 1 && (
                  <Marker coordinate={route[route.length - 1]} title="You" />
                )}
              </MapView>
            ) : (
              <Text style={styles.loadingText}>Waiting for location...</Text>
            )}
          </View>

          {/* Pass location update function to LocationTracker */}
          <LocationTracker onLocationUpdate={handleLocationUpdate} />

          {/* Display list of coordinates */}

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

          <View>


           <TouchableOpacity onPress={saveTrek} style={styles.savebutton}>
              <Text style={{ color: "white", textAlign: "center" }}>
                Save Trek
              </Text>
            </TouchableOpacity> 


          </View>
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
    backgroundColor: "#fff",
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    height: 300,
    flex: 1,
    borderWidth: 2,
    borderColor: "black",
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coordinateItem: {
    fontSize: 14,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  savebutton: {
    backgroundColor: "#00897b",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 300,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "black",
  },
});
