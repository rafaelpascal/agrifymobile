import { BaseModal } from "./BaseModal";
const thumbsup = require("../../../assets/icon/thumbup.png");
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

interface IModalPropsType {
  userId: string | undefined;
  isOpen: boolean;
  handleContinue: () => void;
  closeModal: () => void;
}

export const ProductCreated = ({
  userId,
  isOpen,
  closeModal,
  handleContinue,
}: IModalPropsType) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    closeModal();
    handleContinue();
    navigation.navigate("(tabs)", { screen: "Home" });
  };

  return (
    <BaseModal userId={userId} isOpen={isOpen} closeModal={closeModal}>
      <View className="flex bg-themeWhite w-full items-center justify-center">
        <View className="flex flex-col items-center justify-center py-6 lg:w-[336px]">
          <Image source={thumbsup} />
          <Text className="py-4 text-center text-[16px] font-DMSans font-semibold">
            Successful!
          </Text>
          <Text className="text-center text-[14px] text-[#A9A9A9]">
            Your product has been added to your store
          </Text>
        </View>
      </View>
      <View className="sticky bg-themeWhite p-[28px] bottom-0 z-10 flex h-auto items-center justify-center gap-3">
        <TouchableOpacity
          className="w-full h-auto flex justify-center items-center rounded-[10px] bg-themeGreen sm:h-[46px] text-[#fff] [@media(max-width:800px)]:p-3 p-4"
          onPress={handlePress}
        >
          <Text className="text-[16px] text-[#fff]">Continue</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
