import { BaseModal } from "./BaseModal";
const agrifymodal = require("../../../assets/icon/agrifymodal.png");
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

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

export const LogoutModal = ({
  userId,
  isOpen,
  closeModal,
}: IModalPropsType) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    closeModal();
    navigation.navigate("(tabs)", { screen: "Home" });
  };

  return (
    <BaseModal userId={userId} isOpen={isOpen} closeModal={closeModal}>
      <View className="p-[28px] lg:w-[336px]">
        <Text className="text-center text-[16px] font-DMSans font-bold">
          Are you sure you want to log out?
        </Text>
        <View className="sticky bg-themeWhite bottom-0 p-[18px] z-10 flex flex-col items-center justify-between">
          <TouchableOpacity
            className="w-full h-auto mb-4 flex justify-center items-center rounded-[10px] bg-[#F64B4B] sm:h-[46px] text-[#fff] [@media(max-width:800px)]:p-3 p-4"
            onPress={handlePress}
          >
            <Text className="text-[16px] text-[#fff] font-DMSans font-bold">
              Yes, I want to logout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full h-auto flex justify-center items-center rounded-[10px] bg-themeGrey sm:h-[46px] text-[#fff] [@media(max-width:800px)]:p-3 p-4"
            onPress={handlePress}
          >
            <Text className="text-[16px] font-DMSans font-bold text-[#8F94A8]">
              No, not yet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
};
