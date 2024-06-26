import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
const homeFocused = require("../../assets/navigations/homeFocused.png");
const home = require("../../assets/navigations/home.png");
const salesFocused = require("../../assets/navigations/salesFocused.png");
const sales = require("../../assets/navigations/sales.png");
const shopFocused = require("../../assets/navigations/shop.png");
const shop = require("../../assets/navigations/shop1.png");
const settingFocused = require("../../assets/navigations/settingfocused.png");
const settingsvg = require("../../assets/navigations/setting.png");
import { Image } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        // tabBarStyle: { height: 60 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? homeFocused : home} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? salesFocused : sales} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? shopFocused : shop} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
      <Tabs.Screen
        name="personalsettings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? settingFocused : settingsvg} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
    </Tabs>
  );
}
