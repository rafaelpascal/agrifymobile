import { View, Image, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const options = [
    { name: "English", abbreviation: "en" },
    { name: "Yoruba", abbreviation: "yo" },
    { name: "Igbo", abbreviation: "ig" },
    { name: "Hausa", abbreviation: "ha" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, [isLoaded]);

  const changeLanguage = (lng: string) => {
    setSelectedValue(lng);
  };

  return (
    <>
      <StatusBar style="auto" hidden={true} />
      {isLoaded ? (
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
          <TouchableOpacity className="absolute bottom-10 bg-themeGreen w-full h-auto flex justify-center items-center rounded-[4px]">
            <Link
              href="/sign-up"
              className="text-[16px] w-full h-full text-[#fff] text-center py-5 flex justify-center items-center font-bold"
            >
              Ok
            </Link>
          </TouchableOpacity>
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
  );
}
