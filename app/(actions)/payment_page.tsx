import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  marchant_acc,
  get_banks,
  varify_acc,
  save_acc,
  change_pin,
  new_pin,
} from "../../utils/apiService";
import { useUser } from "../../context/user-provider";
import { DashboardArea } from "@/components/ui/layout/dashboard/DashboardArea";
import { LogoutModal } from "../../components/ui/modals/LogoutModal";
import { ProductCreated } from "../../components/ui/modals/ProductCreated";
import { AntDesign } from "@expo/vector-icons";
import { PINinput } from "../../components/ui/text-input/pin-input";
import OTPTextInput from "react-native-otp-textinput";
import CountdownTimer from "../../components/ui/display/CountdownTimer";
const changePin = require("../../assets/icon/lock.png");
const payment = require("../../assets/icon/moneys.png");
const notification = require("../../assets/icon/notification.png");
const support = require("../../assets/icon/messages.png");
const logout = require("../../assets/icon/logout.png");
const usersvg = require("../../assets/icon/user1.png");
const dropdown = require("../../assets/icon/dropdown.png");
const back = require("../../assets/icon/goback.png");
const check = require("../../assets/icon/check.png");
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
const search = require("../../assets/icon/search.png");
import { useNavigation } from "@react-navigation/native";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

interface Bank {
  code: string;
  logo: string;
  name: string;
  slug: string;
  ussd: string;
}

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

const payment_page = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [isselected, setIsselected] = useState(false);
  const [isSelectDropdown, setisSelectDropdown] = useState(false);
  const [isPayment, setisPayment] = useState(false);
  const [bankverified, setbankverified] = useState(false);
  const [isfailed, setisfailed] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [message, setMessage] = useState("");
  const [bankloading, setBankLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bankData, setBankData] = useState({
    accountnumber: "",
  });
  const [userBank, setuserBank] = useState({
    account_number: "",
    account_name: "",
  });

  const handlebankDataInput = (value: string, name: string) => {
    setBankData({ ...bankData, [name]: value });
  };

  // const handlePayment = () => {
  //   setbuttonClicked(true);
  //   setisPayment(true);
  // };

  const handleContinue = () => {
    setisPayment(false);
  };

  const handleSubmitform = async () => {
    try {
      const data = {
        acc_number: userBank.account_number,
        acc_name: userBank.account_name,
        bank: selectedValue,
      };
      const res = await save_acc(data);
      if (res) {
        setMessage("Account Saved Successfully!");
        setIsAccModalOpen(true);
      }
    } catch (error: any) {
      if (error.response) {
        console.log("Response Data:", error.response.data);
        console.log("Response Status:", error.response.status);
        console.log("Response Headers:", error.response.headers);
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };

  const filteredOptions = banks.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setisfailed(false);
    setbankverified(false);
    setIsselected(true);
    setSelectedValue(value);
    setisSelectDropdown(false);
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setBankLoading(true);
        const response = await get_banks();
        setBanks(response.data.banks);
        setBankLoading(false);
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setBankLoading(false);
      }
    };

    fetchBanks();
  }, [isSelectDropdown]);

  const validate_acc = async () => {
    try {
      const bankdetails = {
        acc_number: bankData.accountnumber,
        bank_name: selectedValue,
      };
      const res = await varify_acc(bankdetails);
      if (res) {
        setuserBank(res.data.acc);
        setbankverified(true);
        setIsselected(false);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          setIsselected(false);
          setisfailed(true);
        } else if (error.response.status === 422) {
          console.error("Unprocessable Entity:", error.response.data);
        }
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };

  useEffect(() => {
    validate_acc();
  }, [selectedValue]);

  const handleModalClose = () => {
    setIsAccModalOpen(false);
  };

  const handleGoback = () => {
    navigation.navigate("(tabs)", { screen: "Home" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View className="h-full relative w-full">
            <View className=" w-full px-3">
              <TouchableOpacity
                onPress={handleGoback}
                className="bg-themeGreen/10 w-[78px] mb-3 h-[35px] flex justify-center items-center flex-row rounded-md"
              >
                <Image source={back} />
                <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
                  Go Back
                </Text>
              </TouchableOpacity>
              <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
                Payment Information
              </Text>
              <Text className="font-normal text-[14px] font-DMSans text-[#808080]">
                Enter an account for collecting payment.
              </Text>
            </View>
            <View className=" w-full h-auto mt-3 px-3 z-10">
              <View className="my-2">
                <Text className="text-[14px] font-normal text-[#343434] font-DMSans">
                  Account Number
                </Text>
                <View className="mt-2 border-[1px] px-3 flex flex-row justify-start bg-[#F5F6FB] items-center border-[#A9A9A9] rounded-[4px]">
                  <TextInput
                    className="h-[50px] rounded-[4px] px-1 text-[#343434] text-[13px] font-semibold font-DMSans"
                    placeholder="Enter your account name"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    onChangeText={(text) =>
                      handlebankDataInput(text, "accountnumber")
                    }
                    value={bankData.accountnumber}
                  />
                </View>
              </View>
              <View className="mb-3">
                <TouchableOpacity
                  onPress={() => setisSelectDropdown(!isSelectDropdown)}
                  className="mt-2  border-[1px] h-[50px] px-1 flex flex-row justify-start items-center bg-[#F5F6FB] border-[#A9A9A9] rounded-[4px]"
                >
                  {selectedValue ? (
                    <Text className="ml-2 text-[#181818] text-[14px] font-semibold font-DMSans">
                      {selectedValue}
                    </Text>
                  ) : (
                    <Text className="text-[#A9A9A9] ml-2 text-[14px] font-semibold font-DMSans">
                      Bank Name
                    </Text>
                  )}
                  <Image source={dropdown} className="absolute right-3" />
                </TouchableOpacity>
                {isSelectDropdown && (
                  <View className="w-full">
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
                          {bankloading ? (
                            <View className="flex-1 justify-center items-center">
                              <ActivityIndicator size="large" color="#00A45F" />
                            </View>
                          ) : (
                            <ScrollView className="flex-grow">
                              {filteredOptions.map((option, index) => (
                                <TouchableOpacity
                                  key={index}
                                  className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                                  onPress={() => handleSelect(option.name)}
                                >
                                  <Text>{option.name}</Text>
                                  {selectedValue === option.name && (
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
              {isselected ? (
                <View className="flex-1 mt-3 justify-center items-center">
                  <ActivityIndicator size="large" color="#00A45F" />
                </View>
              ) : (
                <>
                  {bankverified && (
                    <View className="p-2 mb-4 flex flex-row justify-start items-center rounded-lg  w-full bg-themeGreen/10 border-[1px] border-themeGreen">
                      <FontAwesome
                        name="check-circle"
                        size={24}
                        color="#00A45F"
                      />
                      <Text className="font-DMSans ml-2 text-[18px] text-themeGreen font-semibold">
                        {userBank.account_name}
                      </Text>
                    </View>
                  )}
                  {isfailed && (
                    <View className="p-2 mb-4 flex flex-row justify-start items-center rounded-lg  w-full bg-themeDanger/10 border-[1px] border-themeDanger">
                      <MaterialIcons name="cancel" size={24} color="#F64B4B" />
                      <View className="w-[90%]">
                        <Text className="font-DMSans ml-2 text-[16px] text-themeDanger font-bold">
                          Account verification Failed. check the details or try
                          again Later.
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
            <View className="absolute bottom-0 z-0 px-3 pt-4 w-full">
              {bankverified ? (
                <TouchableOpacity
                  onPress={handleSubmitform}
                  className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                >
                  <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="h-[50px] w-[100%] bg- rounded-[4px] bg-themeGrey flex justify-center items-center">
                  <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                    Done
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <ProductCreated
              userId={message}
              isOpen={isAccModalOpen}
              handleContinue={handleContinue}
              closeModal={handleModalClose}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default payment_page;
