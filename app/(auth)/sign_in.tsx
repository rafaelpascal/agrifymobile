import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import * as Application from "expo-application";
const back = require("../../assets/icon/goback.png");
const exteriks = require("../../assets/icon/exteriks.png");
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { sign_in, get_deviceId } from "../../utils/apiService";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useUser } from "../../context/user-provider";

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
  const { user, setUser } = useUser();
  const navigation = useNavigation<NavigationProp>();
  const [code, setCode] = useState<number[]>([]);
  const [isBiometricSupported, setisBiometricSupported] = useState(false);
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [dbDeviceId, setdbDeviceId] = useState(false);
  const [retrieveddeviceid, setretrieveddeviceid] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [deviceInfo, setDeviceInfo] = useState({
    brand: "",
    model: "",
    systemName: "",
    systemVersion: "",
    uniqueId: "",
    deviceType: "",
    manufacturer: "",
    totalMemory: "",
    isTablet: "",
    isDevice: "",
  });

  const codeLength = Array(4).fill(0);

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const OFFSET = 20;
  const TIME = 20;

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const brand = Device.brand || "Unknown";
      const model = Device.modelName || "Unknown";
      const systemName = Device.osName || "Unknown";
      const systemVersion = Device.osVersion || "Unknown";

      // Fetch unique ID based on platform
      // Fetch unique ID based on platform
      let uniqueId = "Unknown";
      if (Device.osName === "Android") {
        uniqueId = Application.getAndroidId() || "Unknown";
      } else if (Device.osName === "iOS") {
        uniqueId = (await Application.getIosIdForVendorAsync()) || "Unknown";
      }

      let deviceType = "Unknown";
      switch (Device.deviceType) {
        case Device.DeviceType.PHONE:
          deviceType = "Phone";
          break;
        case Device.DeviceType.TABLET:
          deviceType = "Tablet";
          break;
        case Device.DeviceType.DESKTOP:
          deviceType = "Desktop";
          break;
        case Device.DeviceType.TV:
          deviceType = "TV";
          break;
      }

      const manufacturer = Device.manufacturer || "Unknown";
      const totalMemory = Device.totalMemory
        ? `${Device.totalMemory} bytes`
        : "Unknown";
      const isDevice = Device.isDevice ? "Yes" : "No";

      const info = {
        brand,
        model,
        systemName,
        systemVersion,
        uniqueId,
        deviceType,
        manufacturer,
        totalMemory,
        isTablet: deviceType === "Tablet" ? "Yes" : "No",
        isDevice,
      };

      setDeviceInfo(info);
      setretrieveddeviceid(info.uniqueId);
    };

    fetchDeviceInfo();
  }, []);

  useEffect(() => {
    const get_device = async () => {
      try {
        const device = await get_deviceId(retrieveddeviceid);
        if (device.data && device.data.device && device.data.device.deviceId) {
          setdbDeviceId(true);
          setUserPhone(device.data.device.phone);
        } else {
          console.log("Device ID not found in response:", device);
        }
      } catch (error) {
        console.log(error);
      }
    };
    get_device();
  }, [retrieveddeviceid]);

  useEffect(() => {
    if (code.length === 4) {
      const codeString = code.join("");
      const handle_signin = async () => {
        try {
          const data = {
            pin_password: codeString,
            phone: userPhone,
            deviceId: retrieveddeviceid,
          };
          const singin = await sign_in(data);
          if (singin.data.code === "00") {
            setUser(singin.data.updatedUsr.id);
            navigation.navigate("(tabs)", { screen: "Home" });
            setCode([]);
          }
        } catch (error) {
          offset.value = withSequence(
            withTiming(-OFFSET, { duration: TIME / 2 }),
            withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
            withTiming(0, { duration: TIME / 2 })
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setCode([]);
        }
      };
      handle_signin();
    }
  }, [code]);

  const onNumberPress = (number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode([...code, number]);
  };

  const numberBackSpace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(code.slice(0, -1));
  };

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setisBiometricSupported(compatible);
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const onBiometricPress = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Touch ID",
        fallbackLabel: "Enter Password",
      });
      setIsAuthenticated(success);
      if (success) {
        console.log("Biometric authentication successful");
        router.push("/tabs/Home");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error("Error during biometric authentication:", error);
    }
  };

  // const onBiometricPress = async () => {
  //   try {
  //     const { success } = await LocalAuthentication.authenticateAsync();
  //     console.log("Biometric authentication result:", success);
  //     if (success) {
  //       router.replace("/");
  //     } else {
  //       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  //     }
  //   } catch (error) {
  //     console.error("Error during biometric authentication:", error);
  //   }
  // };

  return (
    <SafeAreaView className="h-full p-5">
      <TouchableOpacity
        // onPress={() => setotpPage(false)}
        className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
      >
        <Image source={back} />
        <Text className="text-[14px] ml-2 p-0 text-[#2F2F2F] font-normal">
          Go Back
        </Text>
      </TouchableOpacity>
      <Text className="text-[24px] mt-7 font-bold text-[#343434] font-DMSans">
        Welcome back Musa, Enter your 4-Digit PIN
      </Text>
      <Text className="text-[14px] font-semibold mt-2 text-[#808080] font-DMSans">
        If this is not your account, Log out
      </Text>
      <View className="flex flex-col justify-between pt-10 h-[80%]">
        <Animated.View style={[styles.codeView, style]}>
          {codeLength.map((_, index) => (
            <View
              key={index}
              className="w-[64] border-[1px] h-[64] rounded-full flex justify-center items-center"
            >
              {code[index] && (
                <Text className="text-[#343434] p-0 text-[30px] font-semibold font-DMSans">
                  <Image source={exteriks} />
                </Text>
              )}
            </View>
          ))}
        </Animated.View>

        <View style={[styles.numbersView]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {[1, 2, 3].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => onNumberPress(number)}
              >
                <Text style={styles.number}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {[4, 5, 6].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => onNumberPress(number)}
              >
                <Text style={styles.number}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {[7, 8, 9].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => onNumberPress(number)}
              >
                <Text style={styles.number}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ marginLeft: 5 }}
              onPress={onBiometricPress}
            >
              <FontAwesome6 name="fingerprint" size={26} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNumberPress(0)}>
              <Text style={styles.number}>0</Text>
            </TouchableOpacity>
            <View style={{ minWidth: 25 }}>
              {code.length > 0 && (
                <TouchableOpacity onPress={numberBackSpace}>
                  <Ionicons name="chevron-back-sharp" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  greetings: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    alignSelf: "center",
  },
  codeView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  codeEmpty: {
    width: 64,
    height: 64,

    borderRadius: 50,
    backgroundColor: "#000",
  },
  numbersView: {
    marginHorizontal: 20,
    marginVertical: 10,
    gap: 1,
  },
  number: {
    fontSize: 24,
    padding: 20,
    color: "#363853",
    fontWeight: "semibold",
    borderRadius: 50,
  },
});

export default SignIn;
