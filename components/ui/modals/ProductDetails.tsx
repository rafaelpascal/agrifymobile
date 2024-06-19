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
  isOpen: boolean;
  closeModal: () => void;
  status: boolean;
}

interface ProductDetailsModalType {
  status: boolean;
}

export const ProductDetails = ({
  isOpen,
  closeModal,
  status,
}: IModalPropsType) => {
  return (
    <BaseModal isOpen={isOpen} closeModal={closeModal}>
      <View className="bg-themeGreen/10 h-[48px] flex-row px-4 rounded-[12px] flex justify-between items-center w-full">
        <Text className="text-[16px] font-bold font-DMSans text-themeGreen">
          Product Details
        </Text>
        <TouchableOpacity onPress={closeModal}>
          <MaterialIcons name="cancel" size={24} color="green" />
        </TouchableOpacity>
      </View>
      <View className="flex bg-themeWhite w-full p-[28px] items-start justify-start">
        <View className="flex flex-row justify-start items-start gap-2">
          <Image source={productImage} className="rounded-lg" />
          <Image source={productImage} className="rounded-lg" />
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Product Category:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            Tubers
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Product Name:
          </Text>
          <Text className="text-center text-[16px] font-DMSans font-bold text-[#25313E]">
            Cassava
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Quantity Sold:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            3 baskets
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Price:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            ₦18,700
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Date sold:
          </Text>
          <Text className="text-center text-[16px]  font-DMSans font-bold text-[#25313E]">
            25/04/2024
          </Text>
        </View>
        <View className="flex h-auto my-2 w-full flex-row items-start justify-between lg:w-[336px]">
          <Text className="text-center text-[16px] font-DMSans font-normal">
            Status:
          </Text>
          {status === true ? (
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
