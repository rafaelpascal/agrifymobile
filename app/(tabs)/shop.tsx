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
import { all_product, get_previous_sales } from "../../utils/apiService";
import { useUser } from "../../context/user-provider";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const plus = require("../../assets/images/plus.png");

type Item = {
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
};
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

export default function Shops() {
  const { user } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemPressed, setItemPressed] = useState<ViewItem>(defaultItem);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [dashboardHeroCards, setDashboardHeroCards] = useState<
    DashboardCardProps[]
  >([
    {
      icon: product,
      title: "Total Product",
      value: 0,
    },
    {
      icon: sales,
      title: "Total Sales",
      value: 0,
    },
    {
      icon: stock,
      title: "Stock Left",
      value: 0,
    },
  ]);

  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  //
  useEffect(() => {
    const getAllProduct = async () => {
      try {
        const allproduct = await all_product();
        const all_previous_sales = await get_previous_sales(user);
        const previoussales = all_previous_sales?.completed_sales.rows;
        const productCount = allproduct.data?.allproduct.count;
        const products = allproduct.data?.allproduct.rows;

        const transformedData = products.map((product: any) => {
          const firstImage = product.images[0];
          const firstPricing = product.pricings[0];

          return {
            icon: firstImage.imageUrl,
            title: product.productName,
            qty: `${product.currentQuantity}`,
            status: product.status || false,
            value: firstPricing.price,
          };
        });

        const totalCurrentQuantity = products.reduce(
          (sum: number, product: any) =>
            sum + (parseInt(product.currentQuantity) || 0),
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

        setItems(transformedData);
        setDashboardHeroCards(updatedDashboardHeroCards);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProduct();
  }, []);

  const handleItemPressed = (item: ViewItem) => {
    setItemPressed(item);
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
                  ({items.length})
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
            userId=""
            itemp={itemPressed}
            status={itemPressed.status}
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
