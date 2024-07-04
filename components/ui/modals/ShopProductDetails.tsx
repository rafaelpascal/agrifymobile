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
const productImage = require("../../../assets/images/productimg.png");
const warn = require("../../../assets/icon/jam_alert.png");

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

interface Item {
  category: string;
  dateAdded: string;
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
}

interface IModalPropsType {
  itemp: Item;
  userId: string | undefined;
  isOpen: boolean;
  closeModal: () => void;
  status: boolean;
}

interface ProductDetailsModalType {
  status: boolean;
}

export const ShopProductDetails = ({
  userId,
  isOpen,
  itemp,
  closeModal,
  status,
}: IModalPropsType) => {
  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const price = currencyFormatter.format(itemp.value);

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
      <View className="flex bg-themeWhite w-full p-[20px] items-start justify-start">
        <View className="flex flex-row justify-start items-start mb-2">
          <Image
            source={{ uri: itemp.icon }}
            className="rounded-lg mb-3"
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View className="border-[1px] border-[#E6E6E8] px-3 rounded-[8px]">
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Product Category:
            </Text>
            <Text className="text-center text-[14px]  font-DMSans font-bold text-[#25313E]">
              {itemp.category}
            </Text>
          </View>
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Product Name:
            </Text>
            <Text className="text-center text-[14px] font-DMSans font-bold text-[#25313E]">
              {itemp.title}
            </Text>
          </View>
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Total Quantity:
            </Text>
            <Text className="text-center text-[14px]  font-DMSans font-bold text-[#25313E]">
              {itemp.qty} baskets
            </Text>
          </View>
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Quantity Sold:
            </Text>
            <Text className="text-center text-[14px]  font-DMSans font-bold text-[#25313E]">
              3 baskets
            </Text>
          </View>
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Quantity Lef:
            </Text>
            <Text className="text-center text-[14px]  font-DMSans font-bold text-[#25313E]">
              2 baskets
            </Text>
          </View>
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Price:
            </Text>
            <Text className="text-center text-[14px]  font-DMSans font-bold text-[#25313E]">
              {price}
            </Text>
          </View>
          <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
            <Text className="text-center text-[14px] font-DMSans font-normal">
              Date Added:
            </Text>
            <Text className="text-center text-[14px]  font-DMSans font-bold text-[#25313E]">
              {itemp.dateAdded}
            </Text>
          </View>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between">
          {itemp.qty <= 100 ? (
            <View className="bg-themeGreen/10 w-full  rounded-[4px] px-2 py-3">
              <Text className="text-center text-[14px] font-DMSans font-bold text-themeGreen">
                You have 4 Baskets Left
              </Text>
            </View>
          ) : (
            <View className="bg-[#A41E00]/5 w-full flex flex-row justify-center items-center rounded-[4px] px-2 py-3">
              <Image source={warn} />
              <Text className="text-center ml-2 text-[14px]  font-DMSans font-bold text-[#A41E00]">
                You have 2 Baskets Left, Restock!
              </Text>
            </View>
          )}
        </View>
      </View>
    </BaseModal>
  );
};
