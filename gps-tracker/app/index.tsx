import React, { useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LocationTracker from "../components/LocationTracker";
import TrekInput from "../components/TrekInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  // useEffect(() => {
  //   const clearStorage = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log("Local storage cleared!");
  //     } catch (error) {
  //       console.error("Failed to clear storage:", error);
  //     }
  //   };

  //   clearStorage();
  // }, []);

  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView>
        <View style={styles.overlay}>
          <Text style={styles.text}>TrekMate</Text>
          <LocationTracker />
          <TrekInput />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#007bff",
            padding: 15,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => router.push("/viewtrek")}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            View Treks
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#2e7d32",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
