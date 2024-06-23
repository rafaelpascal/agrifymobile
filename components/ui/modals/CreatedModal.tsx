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

export const CreatedModal = ({
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
      <View className="flex bg-themeWhite w-full px-[28px] py-4 items-center justify-center">
        <View className="flex flex-col items-center justify-center lg:w-[336px]">
          <Image source={agrifymodal} />
          <Text className="pb-2 text-center text-[16px] font-DMSans font-semibold">
            Hello {userId}!
          </Text>
          <Text className="text-center text-[14px] text-[#A9A9A9]">
            Welcome to your Agrify Store
          </Text>
        </View>
      </View>
      <View className="sticky bg-themeWhite bottom-0 p-[28px] z-10 flex items-center justify-center">
        <TouchableOpacity
          className="w-full h-auto flex justify-center items-center rounded-[10px] bg-themeGreen sm:h-[46px] text-[#fff] [@media(max-width:800px)]:p-3 p-4"
          onPress={handlePress}
        >
          <Text className="text-[16px] text-[#fff]">Proceed to store</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
