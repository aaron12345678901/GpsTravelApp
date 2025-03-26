import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function ViewTrek() {
  const [treks, setTreks] = useState([]);
  const [expandedTrekIndex, setExpandedTrekIndex] = useState(null);
  const [newTrekName, setNewTrekName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const savedTreks = await AsyncStorage.getItem("treks");
        if (savedTreks) {
          setTreks(JSON.parse(savedTreks));
        }
      } catch (error) {
        console.error("Error retrieving treks:", error);
      }
    };

    fetchTreks();
  }, []);

    // useEffect(() => {
    //   loadTreks();
    // }, []);
  
    // const loadTreks = async () => {
    //   try {
    //     const savedTreks = await AsyncStorage.getItem("treks");
    //     if (savedTreks) {
    //       setTreks(JSON.parse(savedTreks));
    //     }
    //   } catch (error) {
    //     console.error("Failed to load treks:", error);
    //   }
    // };




  const toggleExpand = (index) => {
    setExpandedTrekIndex(expandedTrekIndex === index ? null : index);
  };

  const deleteTrek = async (index) => {
    Alert.alert(
      "Delete Trek",
      "Are you sure you want to delete this trek?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updatedTreks = treks.filter((_, i) => i !== index);
              await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
              setTreks(updatedTreks);
              Alert.alert("Success", "Trek deleted successfully!");
            } catch (error) {
              console.error("Error deleting trek:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const startEditing = (index, currentName) => {
    setEditingIndex(index);
    setNewTrekName(currentName);
  };

  const saveTrekName = async (index) => {
    const updatedTreks = treks.map((trek, i) =>
      i === index ? { ...trek, name: newTrekName } : trek
    );
    try {
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
      setTreks(updatedTreks);
      setEditingIndex(null);
      Alert.alert("Success", "Trek name updated successfully!");
    } catch (error) {
      console.error("Error updating trek name:", error);
    }
  };






 const getSavedTreks = async () => {
    try {
      const savedTreks = await AsyncStorage.getItem("treks");
      if (savedTreks) {
        const parsedTreks = JSON.parse(savedTreks);

        parsedTreks.forEach((trek, index) => {
          if (
            typeof trek !== "object" ||
            !trek.name ||
            !Array.isArray(trek.route)
          ) {
            console.warn(`Skipping invalid trek at index ${index}:`, trek);
            return;
          }

          console.log(`Trek ${index + 1}: Name - ${trek.name}`);

          trek.route.forEach((coord, i) => {
            console.log(`  Point ${i + 1}: ${JSON.stringify(coord)}`);
          });
        });
      }
    } catch (error) {
      console.error("Error retrieving treks:", error);
    }
  };






  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Stored Treks</Text>

      {treks.length === 0 ? (
        <Text style={styles.noTrekText}>No treks saved.</Text>
      ) : (
        treks.map((trek, index) => (
          <View key={index} style={styles.trekItem}>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <Text style={styles.trekName}>{trek.name}</Text>
            </TouchableOpacity>

            {expandedTrekIndex === index && (
              <>
                {trek.route?.length > 0 ? (
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: trek.route[0].latitude,
                        longitude: trek.route[0].longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      {/* Start Marker */}
                      <Marker coordinate={trek.route[0]} title="Start" />

                      {/* Polyline for Route */}
                      <Polyline
                        coordinates={trek.route}
                        strokeWidth={4}
                        strokeColor="blue"
                      />

                      {/* End Marker */}
                      <Marker
                        coordinate={trek.route[trek.route.length - 1]}
                        title="End"
                      />
                    </MapView>
                  </View>
                ) : (
                  <Text style={styles.noRouteText}>No coordinates recorded</Text>
                )}

                <View style={styles.coordinatesContainer}>
                  {trek.route?.map((coord, i) => (
                    <Text key={i} style={styles.coordinateText}>
                      Point {i + 1}: Lat {coord.latitude}, Lng {coord.longitude}
                    </Text>
                  ))}
                </View>
              </>
            )}

            {editingIndex === index ? (
              <View>
                <TextInput
                  style={styles.input}
                  value={newTrekName}
                  onChangeText={setNewTrekName}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => saveTrekName(index)}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(index, trek.name)}
              >
                <Text style={styles.buttonText}>Edit Name</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTrek(index)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={getSavedTreks}
                >
                  <Text style={styles.buttonText}>Get Treks</Text>
                </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  noTrekText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  trekItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  trekName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    height: 300,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  noRouteText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginVertical: 10,
  },
  coordinatesContainer: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  coordinateText: {
    fontSize: 14,
    paddingVertical: 2,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#00796b",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },
  editButton: {
    backgroundColor: "#0288d1",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#388e3c",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },










  startButton: {
    backgroundColor: "#00796B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

});
