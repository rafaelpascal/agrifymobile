import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
import { DashboardCardRow } from "../../components/grouped-components/dashboard-card-row";
import { DashboardCardProps } from "../../components/ui/dashboardCard/dashboardCard";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");

export default function Sales() {
  const [dashboardHeroCards, setDashboardHeroCards] = useState<
    DashboardCardProps[]
  >([
    {
      icon: sales,
      title: "Sales Balance",
      value: "₦300,230",
    },
    {
      icon: product,
      title: "Pending Order",
      value: "₦25,000",
    },
  ]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        <View className="w-full h-full">
          <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
            Sales
          </Text>
          <Text className="font-semibold text-[13px] font-DMSans text-[#8F94A8]">
            View your sales record from your store
          </Text>
          <View className="w-full my-4">
            <DashboardCardRow dashboardHeroCards={dashboardHeroCards} />
          </View>
        </View>
      </DashboardArea>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
