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
import LinearGradient from "react-native-linear-gradient";

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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.overlay}>
          <Text style={styles.text}>TrekMate</Text>
          <LocationTracker />
          <TrekInput />
          <TouchableOpacity
            style={styles.viewroutesbutton}
            onPress={() => router.push("/viewtrek")}
          >
            <Text style={styles.viewbuttontext}>View Treks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    justifyContent: "center",
  },

  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    width: 350,
  },
  text: {
    color: "white",
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 20,
  },

  viewroutesbutton: {
    backgroundColor: "#0288D1",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: 200,
  },
  viewbuttontext: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
});
