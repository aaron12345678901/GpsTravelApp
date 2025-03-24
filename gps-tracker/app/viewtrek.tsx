import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ViewTrek() {
  const [treks, setTreks] = useState([]);
  const [expandedTrekIndex, setExpandedTrekIndex] = useState(null);
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

  const toggleExpand = (index) => {
    setExpandedTrekIndex(expandedTrekIndex === index ? null : index);
  };

  const deleteTrek = async (index) => {
    try {
      const updatedTreks = treks.filter((_, i) => i !== index);
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
      setTreks(updatedTreks);
      Alert.alert("Success", "Trek deleted successfully!");
    } catch (error) {
      console.error("Error deleting trek:", error);
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
              <View style={styles.coordinatesContainer}>
                {trek.route?.length > 0 ? (
                  trek.route.map((coord, i) => (
                    <Text key={i} style={styles.coordinateText}>
                      Point {i + 1}: Lat {coord.latitude}, Lng {coord.longitude}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.coordinateText}>
                    No coordinates recorded
                  </Text>
                )}
              </View>
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
    color: "#007bff",
  },
  coordinatesContainer: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
