import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

// Define the types for the props
interface SwitchButtonProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        trackColor={{ false: "#fff", true: "#00A45F" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default SwitchButton;
