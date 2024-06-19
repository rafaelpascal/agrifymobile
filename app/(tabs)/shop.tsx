import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from "react-native";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
import { DashboardCardRow } from "../../components/grouped-components/dashboard-card-row";
import { PreviousItems } from "../../components/ui/product/PreviousItems";
import { DashboardCardProps } from "../../components/ui/dashboardCard/dashboardCard";
import { ShopProductDetails } from "../../components/ui/modals/ShopProductDetails";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const plus = require("../../assets/images/plus.png");

const items = [
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Irish Potatoes",
    qty: "5 baskets",
    status: false,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Sweet Potatoes",
    qty: "20 baskets",
    status: true,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Yam",
    qty: "3 baskets",
    status: true,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Irish Potatoes",
    qty: "5 baskets",
    status: false,
    value: 200,
  },
];

export default function Shops() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [dashboardHeroCards, setDashboardHeroCards] = useState<
    DashboardCardProps[]
  >([
    {
      icon: product,
      title: "Total Product",
      value: "0",
    },
    {
      icon: sales,
      title: "Total Sales",
      value: "3000",
    },
    {
      icon: stock,
      title: "Stock Left",
      value: "0",
    },
  ]);

  const handleItemPressed = (item: any) => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        <View className="w-full h-full">
          <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
            Shop
          </Text>
          <Text className="font-semibold text-[13px] font-DMSans text-[#8F94A8]">
            You can see what you have in your shop and manage them.
          </Text>
          <View className="flex h-full mt-4 items-center justify-start w-full rounded-[8px]">
            <DashboardCardRow dashboardHeroCards={dashboardHeroCards} />
            <View className="w-full my-6">
              <TouchableOpacity
                onPress={() => setIsNewProduct(true)}
                className="h-[38px] flex-row bg-themeGreen rounded-[4px] flex justify-center items-center w-full"
              >
                <Image source={plus} />
                <Text className="text-themeGrey ml-2 text-[14px] font-semibold font-DMSans">
                  Add Product to shop
                </Text>
              </TouchableOpacity>
            </View>
            <View className="my-2 flex w-full flex-row justify-between items-center">
              <View className="w-[228px] flex-row px-4 flex justify-start items-center h-[36px] border-[1px] border-[#E6E6E8] bg-transparent rounded-[8px]">
                <Feather name="search" size={20} color="black" />
                <TextInput
                  placeholder="Search"
                  className="w-full h-full rounded-[8px] ml-2"
                  placeholderTextColor="#435060"
                ></TextInput>
              </View>
              <View className="w-[112px] flex-row px-4 flex justify-between items-center h-[36px] border-[1px] border-[#E6E6E8] bg-transparent rounded-[8px]">
                <TextInput
                  placeholder="Filter"
                  className="w-auto h-full rounded-[8px]"
                  placeholderTextColor="#435060"
                ></TextInput>
                <AntDesign name="caretdown" size={14} color="black" />
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View className="flex bg-[#F1F2F2] px-[12px] py-2 rounded-[4px] flex-row justify-between items-start w-full">
                <Text className="text-[14px] font-semibold font-DMSans ">
                  Item List
                </Text>
                <Text className="text-themeGreen text-[14px] font-semibold font-DMSans ">
                  (4)
                </Text>
              </View>
              <View className="flex h-auto flex-col w-full justify-center items-start">
                {items.map((item, index) => (
                  <PreviousItems
                    list=""
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    qty={item.qty}
                    status={item.status}
                    value={item.value}
                    onItemPressed={() => handleItemPressed(item)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
          <ShopProductDetails
            status={false}
            isOpen={isModalOpen}
            closeModal={handleModalClose}
          />
        </View>
      </DashboardArea>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 150,
    width: "auto",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
