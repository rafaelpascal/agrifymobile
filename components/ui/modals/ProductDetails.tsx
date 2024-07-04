import { BaseModal } from "./BaseModal";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { get_order } from "../../../utils/apiService";
import { useEffect, useState } from "react";
// const productImage = require("../../../assets/images/productimg.png");

type RootStackParamList = {
  "(tabs)": NavigatorScreenParams<TabParamList>;
  "+not-found": undefined;
  Other: undefined;
};

type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(tabs)">,
  BottomTabNavigationProp<TabParamList>
>;

interface IModalPropsType {
  userId: string | undefined;
  isOpen: boolean;
  closeModal: () => void;
  status: boolean;
}

type ViewItem = {
  id: string;
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
};

const defaultItem: ViewItem = {
  id: "",
  icon: "",
  title: "",
  qty: 0,
  status: false,
  value: 0,
  amount: 0,
};

export const ProductDetails = ({
  userId,
  isOpen,
  closeModal,
  status,
}: IModalPropsType) => {
  const [catgory, setCategories] = useState("");
  const [productImage, setproductImage] = useState("");
  const [productName, seproductName] = useState("");
  const [gtySold, setgtySold] = useState("");
  const [price, setPrice] = useState("");
  const [dateSold, setdateSold] = useState("");
  const [isstatus, setStatus] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const order = await get_order(userId);
        setproductImage(order.completed_sales.product.images[0].imageUrl);
        setCategories(order.completed_sales.product.category);
        seproductName(order.completed_sales.product.productName);
        setgtySold(order.completed_sales.qty);
        setPrice(order.completed_sales.amount);
        setdateSold(order.completed_sales.updatedAt.split("T")[0]); //ADD DATE SOLD AND REPLACE
        setStatus(order.completed_sales.status);
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userId]);

  return (
    <BaseModal userId={userId} isOpen={isOpen} closeModal={closeModal}>
      <View className="bg-themeGreen/10 h-[48px] flex-row px-4 rounded-[14px] flex justify-between items-center w-full">
        <Text className="text-[16px] font-bold font-DMSans text-themeGreen">
          Product Details
        </Text>
        <TouchableOpacity onPress={closeModal}>
          <MaterialIcons name="cancel" size={24} color="green" />
        </TouchableOpacity>
      </View>
      <View className="flex bg-themeWhite w-full p-[28px] items-start justify-start">
        <View className="flex flex-row justify-start items-start">
          {productImage ? (
            <View>
              <Image
                source={{ uri: productImage }}
                className="rounded-lg mb-3"
                style={{ width: 50, height: 50 }}
              />
            </View>
          ) : (
            <View>
              <Text>Loading...</Text>
            </View>
          )}
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Product Category:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            {catgory}
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Product Name:
          </Text>
          <Text className="text-center text-[16px] font-DMSans font-bold text-[#25313E]">
            {productName}
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Quantity Sold:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            {gtySold} baskets
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Price:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            {price}
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Date sold:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            {dateSold}
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Status:
          </Text>
          {isstatus === true ? (
            <View className="bg-themeGreen/10  rounded-[4px] px-2 py-1">
              <Text className="text-center text-[16px]  font-DMSans font-bold text-themeGreen">
                Sold
              </Text>
            </View>
          ) : (
            <View className="bg-[#D48B1F]/10  rounded-[4px] px-2 py-1">
              <Text className="text-center text-[16px]  font-DMSans font-bold text-[#D48B1F]">
                Pending
              </Text>
            </View>
          )}
        </View>
      </View>
    </BaseModal>
  );
};
