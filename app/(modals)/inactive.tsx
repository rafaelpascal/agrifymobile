import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

const inactive = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={100} style={styles.blurContainer}></BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
  },
  background: {
    flex: 1,
    flexWrap: "wrap",
  },
  box: {
    width: "25%",
    height: "20%",
  },
  boxEven: {
    backgroundColor: "orangered",
  },
  boxOdd: {
    backgroundColor: "gold",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});

export default inactive;
