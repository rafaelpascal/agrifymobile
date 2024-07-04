import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { DashboardArea } from "@/components/ui/layout/dashboard/DashboardArea";
import { LogoutModal } from "../../components/ui/modals/LogoutModal";
import { AntDesign } from "@expo/vector-icons";
import SwitchButton from "../../components/ui/text-input/switch-input";
const changePin = require("../../assets/icon/lock.png");
const payment = require("../../assets/icon/moneys.png");
const notification = require("../../assets/icon/notification.png");
const support = require("../../assets/icon/messages.png");
const logout = require("../../assets/icon/logout.png");
const usersvg = require("../../assets/icon/user1.png");
import { useNavigation } from "@react-navigation/native";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type RootStackParamList = {
  // "(auth)": NavigatorScreenParams<AuthStackParamList>;
  "(actions)": NavigatorScreenParams<TabParamList>;
  "+not-found": undefined;
  Other: undefined;
};

type TabParamList = {
  personal_info: undefined;
  change_password: undefined;
  payment_page: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(actions)">,
  BottomTabNavigationProp<TabParamList>
>;

export default function personalsettings() {
  const navigation = useNavigation<NavigationProp>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handlePersonalInfo = () => {
    navigation.navigate("(actions)", { screen: "personal_info" });
  };

  const handleChangepin = () => {
    navigation.navigate("(actions)", { screen: "change_password" });
  };

  const handlePayment = () => {
    navigation.navigate("(actions)", { screen: "payment_page" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        <View className="h-[70vh]">
          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View className="h-full w-full">
              <Text className="font-bold text-[20px] h-[44px] font-DMSans text-[#25313E]">
                Settings
              </Text>
              <View className="w-full">
                <TouchableOpacity
                  onPress={handlePersonalInfo}
                  className="h-[65px] flex flex-row justify-between items-center w-full"
                >
                  <View className="flex flex-row justify-start items-center">
                    <Image source={usersvg} />
                    <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                      Personal Information
                    </Text>
                  </View>
                  <AntDesign name="right" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <View className="w-full">
                <TouchableOpacity
                  onPress={handleChangepin}
                  className="h-[65px] flex flex-row justify-between items-center w-full"
                >
                  <View className="flex flex-row justify-start items-center">
                    <Image source={changePin} />
                    <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                      Change PIN
                    </Text>
                  </View>
                  <AntDesign name="right" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <View className="w-full">
                <TouchableOpacity
                  onPress={handlePayment}
                  className="h-[65px] flex flex-row justify-between items-center w-full"
                >
                  <View className="flex flex-row justify-start items-center">
                    <Image source={payment} />
                    <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                      Payment
                    </Text>
                  </View>
                  <AntDesign name="right" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <View className="w-full h-[65px] flex flex-row justify-between items-center">
                <TouchableOpacity>
                  <View className="flex flex-row justify-start items-center">
                    <Image source={notification} />
                    <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                      Notifications
                    </Text>
                  </View>
                </TouchableOpacity>
                <SwitchButton value={isEnabled} onValueChange={toggleSwitch} />
              </View>
              <View className="w-full">
                <TouchableOpacity className="h-[65px] flex flex-row  justify-between items-center w-full">
                  <View className="flex flex-row justify-start items-center">
                    <Image source={support} />
                    <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                      Support Center
                    </Text>
                  </View>
                  <AntDesign name="right" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <View className="w-full">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="h-[65px] flex flex-row justify-between items-center w-full"
                >
                  <View className="flex flex-row justify-start items-center">
                    <Image source={logout} />
                    <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                      Logout
                    </Text>
                  </View>
                  <AntDesign name="right" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <LogoutModal
            userId=""
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
    paddingBottom: 0,
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
