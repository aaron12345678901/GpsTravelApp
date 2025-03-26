import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function TrekInput() {
  const [treks, setTreks] = useState([]);
  const [newTrek, setNewTrek] = useState("");
  const [showInput, setShowInput] = useState(false);
  const router = useRouter();

  // Load treks when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadTreks = async () => {
        try {
          const savedTreks = await AsyncStorage.getItem("treks");
          if (savedTreks) {
            setTreks(JSON.parse(savedTreks));
          }
        } catch (error) {
          console.error("Failed to load treks:", error);
        }
      };

      loadTreks();
    }, [])
  );

  const saveTrek = async () => {
    if (newTrek.trim() === "") return;

    const updatedTreks = [...treks, { name: newTrek, route: [] }];
    setTreks(updatedTreks);
    setNewTrek("");
    setShowInput(false);

    try {
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
    } catch (error) {
      console.error("Failed to save trek:", error);
    }
  };

  const startTrek = (trek) => {
    router.push({
      pathname: "/trek",
      params: { name: trek.name },
    });
  };

  return (
    <View style={styles.container}>
      {!showInput && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(true)}
        >
          <Text style={styles.buttonText}>Add New Trek</Text>
        </TouchableOpacity>
      )}

      {showInput && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter trek name..."
            placeholderTextColor="#aaa"
            value={newTrek}
            onChangeText={setNewTrek}
          />
          <TouchableOpacity
            style={styles.addTrekButton}
            onPress={saveTrek}
          >
            <Text style={styles.buttonText}>Start Trek</Text>
          </TouchableOpacity>
        </View>
      )}

      <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#0288D1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  addTrekButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#aaa",
    marginTop: 10,
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
