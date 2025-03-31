import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function TrekInput() {
  // State to store the list of treks
  const [treks, setTreks] = useState([]);
  
  // State for new trek input
  const [newTrek, setNewTrek] = useState("");
  
  // Controls the visibility of the input field
  const [showInput, setShowInput] = useState(false);
  
  // Router for navigation
  const router = useRouter();

  // Load saved treks from AsyncStorage when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadTreks = async () => {
        try {
          const savedTreks = await AsyncStorage.getItem("treks");
          if (savedTreks) {
            setTreks(JSON.parse(savedTreks)); // Convert JSON back to array
          }
        } catch (error) {
          console.error("Failed to load treks:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to load treks.",
          });
        }
      };

      loadTreks();
    }, [])
  );

  // Function to save a new trek
  const saveTrek = async () => {
    const trimmedTrek = newTrek.trim();

    // Check if the input is empty
    if (trimmedTrek === "") {
      Alert.alert("Invalid Input", "Trek name cannot be empty.");
      return;
    }

    // Prevent duplicate trek names
    if (treks.some((t) => t.name.toLowerCase() === trimmedTrek.toLowerCase())) {
      Alert.alert("Duplicate Trek", "A trek with this name already exists.");
      return;
    }

    // Create a new trek and update state
    const updatedTreks = [...treks, { name: trimmedTrek, route: [] }];
    setTreks(updatedTreks);
    setNewTrek(""); // Clear input
    setShowInput(false); // Hide input field

    try {
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks)); // Save to AsyncStorage
      Toast.show({
        type: "success",
        text1: "Trek Added",
        text2: `Successfully added "${trimmedTrek}"!`,
      });
    } catch (error) {
      console.error("Failed to save trek:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save trek.",
      });
    }
  };

  // Function to navigate to the trek details screen
  const startTrek = (trek) => {
    router.push({
      pathname: "/trek",
      params: { name: trek.name },
    });
  };

  return (
    <View style={styles.container}>
      {/* Button to show input field */}
      {!showInput && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(true)}
        >
          <Text style={styles.buttonText}>+ Add New Trek</Text>
        </TouchableOpacity>
      )}

      {/* Input field for adding a new trek */}
      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter trek name..."
            placeholderTextColor="#aaa"
            value={newTrek}
            onChangeText={setNewTrek}
          />
          <View style={styles.buttonRow}>
            {/* Save button */}
            <TouchableOpacity style={styles.addTrekButton} onPress={saveTrek}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowInput(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List of saved treks */}
      <View style={styles.trekList}>
        {treks.map((trek, index) => (
          <TouchableOpacity
            key={index}
            style={styles.trekItem}
            onPress={() => startTrek(trek)}
          >
            <Text style={styles.trekText}>{trek.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Toast />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
    marginTop: 50,
  },
  addButton: {
    backgroundColor: "#0288D1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 200,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addTrekButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  trekList: {
    marginTop: 10,
    width: "100%",
  },
  trekItem: {
    backgroundColor: "#388E3C",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: "100%",
    alignItems: "center",
  },
  trekText: {
    color: "white",
    fontSize: 16,
  },
});
