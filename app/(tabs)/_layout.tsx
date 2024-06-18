import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
const homeFocused = require("../../assets/navigations/homeFocused.png");
const home = require("../../assets/navigations/home.png");
const salesFocused = require("../../assets/navigations/salesFocused.png");
const sales = require("../../assets/navigations/sales.png");
import { Image } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? homeFocused : home} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? salesFocused : sales} />
          ),
        }}
      />
    </Tabs>
  );
}
