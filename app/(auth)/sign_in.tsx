import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";

type RootStackParamList = {
  // "(auth)": NavigatorScreenParams<AuthStackParamList>;
  "+not-found": undefined;
  Other: undefined;
  "(tabs)": NavigatorScreenParams<TabParamList>;
};

type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Shop: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(tabs)">,
  BottomTabNavigationProp<TabParamList>
>;

const SignIn = () => {
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const [selectedValue, setSelectedValue] = useState("en");

  const options = [
    { name: "English", abbreviation: "en" },
    { name: "Yoruba", abbreviation: "yo" },
    { name: "Igbo", abbreviation: "ig" },
    { name: "Hausa", abbreviation: "ha" },
  ];

  const changeLanguage = (lng: string) => {
    setSelectedValue(lng);
  };

  const handleLogin = () => {
    navigation.navigate("(tabs)", { screen: "Home" });
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  // const handleBiometricAuth = async () => {
  //   const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
  //   if (!savedBiometrics)
  //     return Alert.alert(
  //       "Biometric record not found",
  //       "Please verify your identity with your password",
  //       [
  //         {
  //           text: "OK",
  //           onPress: () => fallBackToDefaultAuth(),
  //         },
  //       ]
  //     );
  // };

  // const fallBackToDefaultAuth = () => {
  //   // Implement fallback authentication method here
  //   console.log("Fallback to default authentication");
  // };

  const handleBiometricAuth = async () => {
    const success = await LocalAuthentication.authenticateAsync();
    console.log(success);

    if (success) {
      router.replace("/index");
    }
  };

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access your account", // Optional
    });

    if (result.success) {
      console.log("Authentication successful!");
      // Proceed with authenticated actions
    } else {
      console.log("Authentication failed or canceled.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View className="relative flex-1  w-full items-center justify-evenly bg-themeGreen px-3">
          <View className="absolute bottom-48 w-[269px] h-auto bg-white flex justify-start py-[20px] rounded-[14px] items-center flex-col">
            <Text>
              {" "}
              {isBiometricSupported
                ? "Your device is compatible with Biometrics"
                : "Face or Fingerprint scanner is available on this device"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleBiometricAuth}
            className="absolute bottom-10 bg-themeGreen w-full h-auto flex justify-center items-center rounded-[4px]"
          >
            <Text className="text-[16px] w-full h-full text-[#fff] text-center py-5 flex justify-center items-center font-bold">
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignIn;
