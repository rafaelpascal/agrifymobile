import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
import { DashboardCardRow } from "../../components/grouped-components/dashboard-card-row";
import { DashboardCardProps } from "../../components/ui/dashboardCard/dashboardCard";
import {
  marchant_acc,
  all_product,
  get_previous_sales,
  get_all_order,
} from "../../utils/apiService";
import { BaseItem } from "../../components/ui/product/listing";
import { useUser } from "../../context/user-provider";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const plus = require("../../assets/images/plus.png");

type ViewItem = {
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
};

const defaultItem: ViewItem = {
  icon: "",
  title: "",
  qty: 0,
  status: false,
  value: 0,
  amount: 0,
};

type RootStackParamList = {
  // "(auth)": NavigatorScreenParams<AuthStackParamList>;
  "(actions)": NavigatorScreenParams<TabParamList>;
  "+not-found": undefined;
  Other: undefined;
};

type TabParamList = {
  add_product: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(actions)">,
  BottomTabNavigationProp<TabParamList>
>;

export default function HomeScreen() {
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState([defaultItem]);
  const [istotalOrder, setistotalOrder] = useState("");
  const [marchantName, setisMarchantName] = useState("");
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

  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    const getallOrder = async () => {
      try {
        const all_previous_sales = await get_all_order(user);

        const previoussales = all_previous_sales?.completed_sales.rows;
        const totalOrder = all_previous_sales?.completed_sales.count;

        const transformedData = previoussales.map((sales: any) => {
          const firstImage = sales.product.images[0];
          return {
            icon: firstImage.imageUrl,
            title: sales.product.productName,
            qty: `${sales.qty}`,
            status: sales.status || false,
            value: sales.amount,
            amount: parseFloat(sales.amount),
          };
        });
        setistotalOrder(totalOrder);
        setItems(transformedData);
      } catch (error: any) {
        if (error.response) {
          console.log("Response Data:", error.response.data);
          console.log("Response Status:", error.response.status);
          console.log("Response Headers:", error.response.headers);
        } else {
          console.error("Error Message:", error.message);
        }
      }
    };
    getallOrder();
  }, []);

  //get all product
  useEffect(() => {
    const getallproduct = async () => {
      try {
        const allproduct = await all_product();
        const all_previous_sales = await get_previous_sales(user);
        const previoussales = all_previous_sales?.completed_sales.rows;
        const productCount = allproduct.data?.allproduct.count;
        // Sum the currentQuantity of all products
        const totalCurrentQuantity = allproduct.data?.allproduct.rows.reduce(
          (sum: any, product: any) => {
            return sum + (parseInt(product.currentQuantity) || 0);
          },
          0
        );
        const pptransformedData = previoussales.map((sales: any) => {
          return {
            amount: parseFloat(sales.amount),
          };
        });

        const totalSalesAmount = pptransformedData.reduce(
          (sum: number, sale: ViewItem) => sum + sale.amount,
          0
        );
        const newamout = currencyFormatter.format(totalSalesAmount);
        const updatedDashboardHeroCards = dashboardHeroCards.map((card) => {
          if (card.title === "Total Product") {
            return { ...card, value: productCount || 0 };
          } else if (card.title === "Stock Left") {
            return { ...card, value: totalCurrentQuantity || 0 };
          } else if (card.title === "Total Sales") {
            return { ...card, value: newamout || 0 };
          }
          return card;
        });
        setDashboardHeroCards(updatedDashboardHeroCards);
      } catch (error) {
        console.log(error);
      }
    };
    getallproduct();
  }, []);

  // Get marchant account
  const marchant = async () => {
    try {
      const acc = await marchant_acc(user);
      setisMarchantName(acc.data.user.lastName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    marchant();
  }, [user]);

  const handlenewProduct = () => {
    navigation.navigate("(actions)", { screen: "add_product" });
  };

  return (
    <>
      <StatusBar style="auto" hidden={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <DashboardArea title={`Welcome ${marchantName}`}>
          <View className="flex h-full items-center justify-start w-full rounded-[8px]">
            <StatusBar style="auto" hidden={false} />
            <DashboardCardRow dashboardHeroCards={dashboardHeroCards} />
            <View className="w-full my-6">
              <TouchableOpacity
                onPress={handlenewProduct}
                className="h-[38px] flex-row bg-themeGreen rounded-[4px] flex justify-center items-center w-full"
              >
                <Image source={plus} />
                <Text className="text-themeGrey ml-2 text-[14px] font-semibold font-DMSans">
                  Add Product to shop
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View className="flex flex-row justify-between items-start w-full">
                <Text className="text-[14px] font-semibold font-DMSans ">
                  Transaction History
                </Text>
                <Text className="text-[#8F94A8] text-[14px] font-semibold font-DMSans ">
                  ({istotalOrder})
                </Text>
              </View>
              <View className="flex h-auto flex-col w-full justify-center items-start">
                <Text className="mt-2 text-[14px] text-[#8F94A8] font-DMSans font-normal">
                  Today
                </Text>
                {items.map((item, index) => (
                  <BaseItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    qty={item.qty}
                    status={item.status}
                    value={item.value}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </DashboardArea>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 150,
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
