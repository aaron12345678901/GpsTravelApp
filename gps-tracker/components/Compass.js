import React, { useEffect, useState, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Magnetometer } from "expo-sensors";

export default function Compass() {
  // State to store the heading angle
  const [heading, setHeading] = useState(0);

  // Animated value to smoothly rotate the compass image
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let subscription;

    // Function to start listening to the magnetometer sensor
    const startMagnetometer = async () => {
      subscription = Magnetometer.addListener((data) => {
        const { x, y } = data;

        // Calculate the angle using atan2 and convert from radians to degrees
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360; // Ensure angle is in the 0 - 360 range

        setHeading(angle);
      });

      //  update interval set to 100ms 
      Magnetometer.setUpdateInterval(100);
    };

    startMagnetometer();

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Animate rotation whenever the heading value updates
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: heading,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  // Interpolate animated value from 0 to 360 degrees
  const rotation = animatedValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.compassContainer}>
      <Animated.Image
        source={require("../assets/images/compass.png")}
        style={[styles.compassImage, { transform: [{ rotate: rotation }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  compassContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "black",
    height: 150,
    width: 150,
    overflow: "hidden",
  },
  compassImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
});
