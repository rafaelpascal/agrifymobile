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
} from "react-native";
import { Link } from "expo-router";
import { useUser } from "../../context/user-provider";
const image = require("../../assets/icon/lets-icons_back-light.png");
const usersvg = require("../../assets/icon/user.png");
const location = require("../../assets/icon/location.png");
const dropdown = require("../../assets/icon/dropdown.png");
const phone = require("../../assets/icon/phone.png");
const check = require("../../assets/icon/check.png");
const search = require("../../assets/icon/search.png");
const loading = require("../../assets/gif/loading.gif");
const emailsvg = require("../../assets/icon/email.png");
import { PINinput } from "../../components/ui/text-input/pin-input";
import CountdownTimer from "../../components/ui/display/CountdownTimer";
import OTPTextInput from "react-native-otp-textinput";
import { CreatedModal } from "../../components/ui/modals/CreatedModal";
import { register, verifyacc, createpin } from "../../utils/apiService";
import { Accountexist } from "../../components/ui/modals/Accountexist";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import axios from "axios";

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
const SignUp = () => {
  const { user, setUser } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedValue, setSelectedValue] = useState("");
  const [otp, setOTP] = useState("");
  const [confirmpin, setConfirmPin] = useState("");
  const [otpPage, setOtpPage] = useState(false);
  const [ispassWord, setispassWord] = useState(false);
  const [isSelectDropdown, setisSelectDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clear, setClear] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isConfirmPass, setisConfirmPass] = useState<boolean>(false);
  const [isExistModalOpen, setIsExistModalOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [pin, setPin] = useState("");
  const [capitals, setCapitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const handleOTPChange = (otp: string) => {
    setOTP(otp);
  };

  const handleInputChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://nga-states-lga.onrender.com/fetch"
      );
      const statesData = response.data;
      setStates(statesData);
      const capitalsData = statesData.map(
        (state: { capital: any }) => state.capital
      );
      setCapitals(capitalsData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormsubmit = async () => {
    try {
      setOtpPage(true);

      // const data = {
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   location: selectedValue,
      //   phone: formData.phone,
      //   email: formData.email,
      // };

      // await register(data);
      // setEmail(formData.email);
      // setName(formData.firstName);
      // setOtpPage(true);
      // setFormData({
      //   firstName: "",
      //   lastName: "",
      //   phone: "",
      //   email: "",
      // });
    } catch (error: any) {
      setMessage(error.response.data.message);
      setIsExistModalOpen(true);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleTimeout = () => {
    setIsTimedOut(true);
  };

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
  };
  const handleconfirmPinChange = (newPin: string) => {
    setConfirmPin(newPin);
  };

  const handlePinSubmit = () => {
    setClear(true);
    setisConfirmPass(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsExistModalOpen(false);
  };

  const handleOtpSubmit = async () => {
    try {
      setispassWord(true);

      // const data = {
      //   otp,
      //   email,
      // };
      // const verifyres = await verifyacc(data);
      // if (verifyres) {
      //   setispassWord(true);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitform = async () => {
    try {
      // const data = {
      //   pin,
      //   email,
      // };
      // const res = await createpin(data);
      // setUser(res.data.fndmarId.id);
      const user = "087a8b59-6f41-4d27-8ce3-f6c603294829";
      setUser(user);
      setIsModalOpen(true);
      setClear(true);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredOptions = states.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {otpPage ? (
          <>
            {ispassWord ? (
              <>
                {isConfirmPass ? (
                  <View className="h-full w-full flex justify-evenly items-start p-4">
                    <TouchableOpacity
                      onPress={() => setisConfirmPass(false)}
                      className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                    >
                      <Image source={image} />
                      <Text className="text-[12px] ml-2 p-0 text-[#2F2F2F] font-normal">
                        Go Back
                      </Text>
                    </TouchableOpacity>
                    <View className="h-auto w-full flex justify-start items-start">
                      <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                        Secure your new account
                      </Text>
                      <View className="w-full mt-[30px] h-[400px] flex justify-start items-start">
                        <Text className="mb-4 text-[14px] font-bold font-DMSans">
                          Confirm Pin
                        </Text>
                        <PINinput
                          length={4}
                          onChange={handleconfirmPinChange}
                          clear={clear}
                        />
                        <View className="w-full h-[30px] mt-4 ">
                          {pin === confirmpin ? (
                            <Text className="text-[14px] font-bold font-DMSans text-themeGreen">
                              Pin match
                            </Text>
                          ) : (
                            <Text className="text-[14px] font-bold font-DMSans text-themeDanger">
                              Pin Doesn't match
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                    {pin !== confirmpin ? (
                      <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                          Done
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handleSubmitform}
                        className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                      >
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                          Done
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View className="h-full w-full flex justify-evenly items-start p-4">
                    <TouchableOpacity
                      onPress={() => setOtpPage(false)}
                      className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                    >
                      <Image source={image} />
                      <Text className="text-[12px] ml-2 p-0 text-[#2F2F2F] font-normal">
                        Go Back
                      </Text>
                    </TouchableOpacity>
                    <View className="h-auto w-full flex justify-start items-start">
                      <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                        Secure your new account
                      </Text>
                      <View className="w-full mt-[30px] h-[400px] flex justify-start items-start">
                        <Text className="mb-4 text-[14px] font-bold font-DMSans">
                          Create new account PIN
                        </Text>
                        <PINinput
                          length={4}
                          onChange={handlePinChange}
                          clear={clear}
                        />
                      </View>
                    </View>
                    {pin.length !== 4 ? (
                      <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                          Done
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handlePinSubmit}
                        className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                      >
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                          Done
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            ) : (
              <View className="h-full w-full flex justify-evenly items-start p-4">
                <TouchableOpacity
                  onPress={() => setOtpPage(false)}
                  className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                >
                  <Image source={image} />
                  <Text className="text-[12px] ml-2 p-0 text-[#2F2F2F] font-normal">
                    Go Back
                  </Text>
                </TouchableOpacity>
                <View className="h-auto w-full flex justify-start items-start">
                  <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                    Enter the code, sent to your phone.
                  </Text>
                  <View className="w-full mt-[30px] h-[400px] flex justify-start items-start">
                    <Text className="mb-4 text-[14px] font-bold font-DMSans">
                      Input OTP received
                    </Text>
                    <OTPTextInput
                      inputCount={5}
                      handleTextChange={handleOTPChange}
                      containerStyle={{
                        marginBottom: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      textInputStyle={{
                        borderWidth: 1,
                        borderColor: "#000",
                        borderRadius: 50,
                        width: 46,
                        height: 46,
                        marginHorizontal: 5,
                      }}
                    />
                    <View className="h-[36px] flex justify-center items-center flex-row">
                      {isTimedOut === false && (
                        <Text className="mr-[2px]"> Resend in</Text>
                      )}
                      <CountdownTimer
                        duration={120}
                        onTimeout={handleTimeout}
                      />
                    </View>
                  </View>
                </View>
                {otp.length !== 5 ? (
                  <TouchableOpacity className="h-[50px] w-[100%] bg- rounded-[4px] bg-themeGrey flex justify-center items-center">
                    <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                      Proceed
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleOtpSubmit}
                    className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                  >
                    <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                      Proceed
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        ) : (
          <View className="h-full w-full flex justify-evenly items-start p-4">
            <TouchableOpacity className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]">
              <Image source={image} />
              <Link
                href="/"
                className="text-[12px] ml-2 p-0 text-[#2F2F2F] font-normal"
              >
                Go Back
              </Link>
            </TouchableOpacity>
            <View className="h-auto z-10 w-full flex justify-start items-start">
              <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                Fill out the form to register.
              </Text>
              <View className=" w-full h-auto mt-3">
                <View className="my-2">
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    First Name
                  </Text>
                  <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={usersvg} />
                    <TextInput
                      className="h-[50px] w-full rounded-[4px] px-3 text-[#343434] text-[13px] font-semibold font-DMSans"
                      placeholder="Enter your First Name"
                      placeholderTextColor="#999"
                      onChangeText={(text) =>
                        handleInputChange(text, "firstName")
                      }
                      value={formData.firstName}
                    />
                  </View>
                </View>
                <View className="my-2">
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    Last Name
                  </Text>
                  <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={usersvg} />
                    <TextInput
                      className="h-[50px] rounded-[4px] px-3 text-[#343434] text-[13px] font-semibold font-DMSans"
                      placeholder="Enter your Last Name"
                      placeholderTextColor="#999"
                      onChangeText={(text) =>
                        handleInputChange(text, "lastName")
                      }
                      value={formData.lastName}
                    />
                  </View>
                </View>
                <View className="my-2 z-20 relative">
                  <TouchableOpacity
                    onPress={() => setisSelectDropdown(!isSelectDropdown)}
                    className="text-[12px] font-normal text-[#343434] font-DMSans"
                  >
                    <Text>Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    className="mt-2  border-[1px] h-[50px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]"
                  >
                    <Image source={location} />
                    {selectedValue ? (
                      <Text className="ml-2 text-[#181818] text-[14px] font-semibold font-DMSans">
                        {selectedValue}
                      </Text>
                    ) : (
                      <Text className="text-[#A9A9A9] ml-2 text-[14px] font-semibold font-DMSans">
                        Select Location
                      </Text>
                    )}
                    <Image source={dropdown} className="absolute right-3" />
                  </TouchableOpacity>
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
                                {filteredOptions.map((option, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                                    onPress={() => handleSelect(option)}
                                  >
                                    <Text>{option}</Text>
                                    {selectedValue === option && (
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
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    Phone number
                  </Text>
                  <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={phone} />
                    <TextInput
                      className="h-[50px] w-full rounded-[4px] px-3 text-[#343434] text-[13px] font-semibold font-DMSans"
                      placeholder="Enter your phone number"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                      onChangeText={(text) => handleInputChange(text, "phone")}
                      value={formData.phone}
                    />
                  </View>
                </View>
                <View className="mt-2">
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    Email (Optional)
                  </Text>
                  <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={emailsvg} />
                    <TextInput
                      className="h-[50px] w-full rounded-[4px] px-3 text-[#343434] text-[13px] font-semibold font-DMSans"
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      onChangeText={(text) => handleInputChange(text, "email")}
                      value={formData.email}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View className="h-[38px] z-0 w-full flex justify-center flex-row gap-2 items-center">
              <Text className="text-[#343434] font-normal text-[16px]">
                You already have an account?
              </Text>
              <TouchableOpacity>
                <Text className="text-themeGreen font-semibold text-[16px]">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            {formData.email === "" ? (
              <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                  Proceed
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFormsubmit}
                className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
              >
                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                  Proceed
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <CreatedModal
        userId={name}
        isOpen={isModalOpen}
        closeModal={handleModalClose}
      />
      <Accountexist
        userId={message}
        isOpen={isExistModalOpen}
        closeModal={handleModalClose}
      />
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

export default SignUp;
