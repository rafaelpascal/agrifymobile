import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { marchant_acc } from "../../utils/apiService";
import { useUser } from "../../context/user-provider";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
const usersvg = require("../../assets/icon/user1.png");
const location = require("../../assets/icon/location.png");
const dropdown = require("../../assets/icon/dropdown.png");
const phone = require("../../assets/icon/phone.png");
const email = require("../../assets/icon/email.png");
const back = require("../../assets/icon/goback.png");
const check = require("../../assets/icon/check.png");
const search = require("../../assets/icon/search.png");

type RootStackParamList = {
  "(tabs)": NavigatorScreenParams<TabParamList>;
  "+not-found": undefined;
  Other: undefined;
};

type TabParamList = {
  Home: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(tabs)">,
  BottomTabNavigationProp<TabParamList>
>;

const personal_info = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [stateselectedValue, setStateSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "",
  });

  const handleInputChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const marchant = async () => {
    try {
      const acc = await marchant_acc(user);
      setFormData(acc.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    marchant();
  }, [user]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://nga-states-lga.onrender.com/fetch"
      );
      const statesData = response.data;
      setStates(statesData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitform = async () => {
    console.log("Hello");
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const locatiofiltered = states.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlestateSelect = (value: string) => {
    setStateSelectedValue(value);
    setModalVisible(false);
  };

  const handleEdit = () => {
    setIsReadOnly(false);
    setEdit(true);
  };

  const handleContinue = () => {
    navigation.navigate("(tabs)", { screen: "Home" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="h-full w-full px-4">
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-themeGreen/10 w-[78px] mb-3 h-[35px] flex justify-center items-center flex-row rounded-md"
        >
          <Image source={back} />
          <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
            Go Back
          </Text>
        </TouchableOpacity>
        <View className="flex my-3 flex-row justify-between w-full items-center h-[27px]">
          <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
            Personal Information
          </Text>
          <TouchableOpacity
            onPress={handleEdit}
            className="flex flex-row justify-center items-center"
          >
            <AntDesign name="edit" size={24} color="#415BE6" />
            {isEdit ? (
              <Text className="text-[14px] ml-1 font-DMSans font-bold text-[#415BE6]">
                Editing
              </Text>
            ) : (
              <Text className="text-[14px] ml-1 font-DMSans font-bold text-[#415BE6]">
                Edit
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="w-full h-auto mb-3">
          <View className="my-2 w-full">
            <Text className="text-[14px] font-normal text-[#343434] font-DMSans">
              First Name
            </Text>
            <View
              className={`mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px] ${
                isEdit ? "bg-[#fff]" : "bg-[#F5F6FB]"
              }`}
            >
              <Image source={usersvg} />
              <TextInput
                className={`h-[50px] w-full rounded-[4px] px-3  text-[13px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                placeholder="Enter your First Name"
                placeholderTextColor="#999"
                readOnly={isReadOnly}
                onChangeText={(text) => handleInputChange(text, "firstName")}
                value={formData.firstName}
              />
            </View>
          </View>
          <View className="my-2 w-full">
            <Text className="text-[14px] font-normal text-[#343434] font-DMSans">
              Last Name
            </Text>
            <View
              className={`mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px] ${
                isEdit ? "bg-[#fff]" : "bg-[#F5F6FB]"
              }`}
            >
              <Image source={usersvg} />
              <TextInput
                className={`h-[50px] w-full rounded-[4px] px-3  text-[13px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                placeholder="Enter your Last Name"
                placeholderTextColor="#999"
                readOnly={isReadOnly}
                onChangeText={(text) => handleInputChange(text, "lastName")}
                value={formData.lastName}
              />
            </View>
          </View>
          <View className="my-2 z-20 w-full relative">
            <TouchableOpacity
              // onPress={() => setisSelectDropdown(!isSelectDropdown)}
              className="text-[14px] font-normal text-[#343434] font-DMSans"
            >
              <Text>Location</Text>
            </TouchableOpacity>
            {isEdit ? (
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                className={`mt-2 border-[1px] px-3 h-[50px] flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px] ${
                  isEdit ? "bg-[#fff]" : "bg-[#F5F6FB]"
                }`}
              >
                <Image source={location} />
                {formData.location ? (
                  <Text
                    className={`ml-2 text-[#A9A9A9] text-[14px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                  >
                    {formData.location}
                  </Text>
                ) : (
                  <Text
                    className={`ml-2 text-[#A9A9A9] text-[14px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                  >
                    Select Location
                  </Text>
                )}
                <Image source={dropdown} className="absolute right-3" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="mt-2 border-[1px] px-3 h-[50px] flex flex-row justify-start items-center bg-[#F5F6FB] border-[#A9A9A9] rounded-[4px]">
                <Image source={location} />
                {formData.location ? (
                  <Text
                    className={`ml-2 text-[#A9A9A9] text-[14px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                  >
                    {formData.location}
                  </Text>
                ) : (
                  <Text
                    className={`ml-2 text-[#A9A9A9] text-[14px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                  >
                    Select Location
                  </Text>
                )}
                <Image source={dropdown} className="absolute right-3" />
              </TouchableOpacity>
            )}
            {modalVisible && (
              <View className="w-full absolute top-[100%] rounded-[4px]">
                <View className="w-full h-full flex transition-[.5s] flex-1 justify-center items-center">
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <View
                      className={`w-[315px] h-[276px] bg-white px-4 py-2 overflow-y-scroll rounded-lg shadow-lg`}
                    >
                      <View className="h-[32px] relative px-2 flex flex-row justify-between items-center w-full rounded-[4px] border-[1px] border-[#CCD0DC]">
                        <TextInput
                          className="h-full w-full"
                          value={searchQuery}
                          onChangeText={(text) => setSearchQuery(text)}
                        />
                        <View className="absolute right-2 flex flex-row justify-center items-center w-auto ">
                          <Text className="text-[10px] mr-2 font-DMSans font-normal text-[#999999]">
                            Search
                          </Text>
                          <Image source={search} />
                        </View>
                      </View>
                      {loading ? (
                        <View>
                          <Text>Loading....</Text>
                        </View>
                      ) : (
                        <ScrollView className="flex-grow">
                          {locatiofiltered.map((option, index) => (
                            <TouchableOpacity
                              key={index}
                              className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                              onPress={() => handlestateSelect(option)}
                            >
                              <Text>{option}</Text>
                              {stateselectedValue === option && (
                                <Image source={check} />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )}
          </View>
          <View className="my-2 z-0">
            <Text className="text-[14px] font-normal text-[#343434] font-DMSans">
              Phone number
            </Text>
            <View
              className={`mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px] ${
                isEdit ? "bg-[#fff]" : "bg-[#F5F6FB]"
              }`}
            >
              <Image source={phone} />
              <TextInput
                className={`h-[50px] w-full rounded-[4px] px-3  text-[13px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                readOnly={isReadOnly}
                onChangeText={(text) => handleInputChange(text, "phone")}
                value={formData.phone}
              />
            </View>
          </View>
          <View className="mt-2 z-0">
            <Text className="text-[14px] font-normal text-[#343434] font-DMSans">
              Email (Optional)
            </Text>
            <View
              className={`mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px] ${
                isEdit ? "bg-[#fff]" : "bg-[#F5F6FB]"
              }`}
            >
              <Image source={email} />
              <TextInput
                className={`h-[50px] w-full rounded-[4px] px-3  text-[13px] font-semibold font-DMSans,
                              ${isEdit ? "text-[#343434]" : "text-[#A9A9A9]"}
                            `}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                readOnly={isReadOnly}
                onChangeText={(text) => handleInputChange(text, "email")}
                value={formData.email}
              />
            </View>
          </View>
          {isEdit && (
            <View className="w-full z-0 my-10">
              <TouchableOpacity
                onPress={handleSubmitform}
                className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
              >
                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 10,
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

export default personal_info;
