import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function TrekInput() {
  const [treks, setTreks] = useState([]);
  const [newTrek, setNewTrek] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [editedTrek, setEditedTrek] = useState("");

  useEffect(() => {
    loadTreks();
  }, []);

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

  const saveTrek = async () => {
    if (newTrek.trim() === "") return;

    const updatedTreks = [...treks, newTrek];
    setTreks(updatedTreks);
    setNewTrek("");
    setShowInput(false);

    try {
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
    } catch (error) {
      console.error("Failed to save trek:", error);
    }
  };

  const handleTrekClick = (trek, index) => {
    setSelectedTrek(index);
    setEditedTrek(trek);
  };

  const updateTrek = async () => {
    if (editedTrek.trim() === "") return;

    const updatedTreks = [...treks];
    updatedTreks[selectedTrek] = editedTrek;

    setTreks(updatedTreks);
    setSelectedTrek(null);

    try {
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
    } catch (error) {
      console.error("Failed to update trek:", error);
    }
  };

  const deleteTrek = async (index) => {
    const updatedTreks = treks.filter((_, i) => i !== index);
    setTreks(updatedTreks);
    setSelectedTrek(null);

    try {
      await AsyncStorage.setItem("treks", JSON.stringify(updatedTreks));
    } catch (error) {
      console.error("Failed to delete trek:", error);
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

  const router = useRouter();

  const startTrek = (trek) => {
    router.push({
      pathname: "/trek",
      params: { name: trek },
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
          <TouchableOpacity style={styles.addTrekButton} onPress={saveTrek}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={treks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.trekItem}>
            <TouchableOpacity onPress={() => handleTrekClick(item, index)}>
              <Text style={styles.trekText}>{item}</Text>
            </TouchableOpacity>

            {selectedTrek === index && (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={editedTrek}
                  onChangeText={setEditedTrek}
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={updateTrek}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => startTrek(item)}
                >
                  <Text style={styles.buttonText}>Start Trek</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTrek(index)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={getSavedTreks}
                >
                  <Text style={styles.buttonText}>get Treks</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
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
  updateButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#00796B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
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
  editContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
});
