import { View, Image, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { get_deviceId } from "../utils/apiService";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Device from "expo-device";
import * as Application from "expo-application";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type RootStackParamList = {
  "(auth)": NavigatorScreenParams<AuthStackParamList>;
  "+not-found": undefined;
  Other: undefined;
  // "(tabs)": NavigatorScreenParams<TabParamList>;
};

export type AuthStackParamList = {
  sign_in: undefined;
  sign_up: undefined;
  // Add other screens as needed
};

type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Shop: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(auth)">,
  BottomTabNavigationProp<TabParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );
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

  const [isLoaded, setIsLoaded] = useState(false);
  const [dbDeviceId, setdbDeviceId] = useState(false);
  const [retrieveddeviceid, setretrieveddeviceid] = useState("");
  const [selectedValue, setSelectedValue] = useState("en");

  const options = [
    { name: "English", abbreviation: "en" },
    { name: "Yoruba", abbreviation: "yo" },
    { name: "Igbo", abbreviation: "ig" },
    { name: "Hausa", abbreviation: "ha" },
  ];

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
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, [isLoaded]);

  const changeLanguage = (lng: string) => {
    setSelectedValue(lng);
  };

  const handleLoginPage = () => {
    navigation.navigate("(auth)", { screen: "sign_in" });
  };

  const handleSignupPage = () => {
    navigation.navigate("(auth)", { screen: "sign_up" });
  };

  return (
    <>
      <StatusBar style="auto" hidden={false} />
      {isLoaded && dbDeviceId === false ? (
        <View className="relative flex-1 items-center justify-evenly bg-[#fff] px-3">
          <Image
            source={require("@/assets/icon/agrifyLogodark.png")}
            style={{ alignSelf: "center" }}
          />
          <View className="w-[233px] h-[209px] flex justify-start p-1 items-center flex-col">
            <Text className="text-themeGreen font-semibold text-[16px]">
              Select your preferred language
            </Text>
            <View className="mt-4">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  className="w-[98px] h-[58px] gap-4 flex flex-row justify-between items-center"
                  onPress={() => changeLanguage(option.abbreviation)}
                >
                  <Text className=" text-left text-[12px] font-DMSans text-[#808080]">
                    {option.name}
                  </Text>
                  <Text className=" text-left text-[12px] font-DMSans text-[#808080]">
                    {selectedValue === option.abbreviation && (
                      <MaterialIcons name="check" size={20} color="black" />
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSignupPage}
            className="absolute bottom-10 bg-themeGreen w-full h-auto flex justify-center items-center rounded-[4px]"
          >
            <Text className="text-[16px] w-full h-full text-[#fff] text-center py-5 flex justify-center items-center font-bold">
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {dbDeviceId ? (
            <View className="flex-1 px-4 relative items-center justify-center bg-[#00A45F]">
              <Image
                source={require("@/assets/icon/agrifyLogin.png")}
                style={{ alignSelf: "center" }}
              />
              <View className="w-full absolute bottom-[120px]">
                <TouchableOpacity className="w-full h-[50px] flex justify-center items-center mb-4 bg-[#FFFFFF] border-[1px] border-[#00A45F]">
                  <Text className="text-[16px] font-DMSans font-semibold text-[#343434]">
                    Register
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLoginPage}
                  className="w-full h-[50px]  flex justify-center items-center  bg-[#FFFFFF] border-[1px] border-[#00A45F]"
                >
                  <Text className="text-[16px] font-DMSans font-semibold text-[#343434]">
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center bg-[#00A45F]">
              <Image
                source={require("@/assets/icon/agrifyLogo.png")}
                style={{ alignSelf: "center" }}
              />
            </View>
          )}
        </>
      )}
    </>
  );
}
