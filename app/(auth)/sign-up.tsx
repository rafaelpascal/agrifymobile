import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
const image = require("../../assets/icon/lets-icons_back-light.png");
const user = require("../../assets/icon/user.png");
const location = require("../../assets/icon/location.png");
const dropdown = require("../../assets/icon/dropdown.png");
const phone = require("../../assets/icon/phone.png");
const email = require("../../assets/icon/email.png");
import { PINinput } from "../../components/ui/text-input/pin-input";
import { CustomDropdown } from "../../components/ui/text-input/select-input";
import CountdownTimer from "../../components/ui/display/CountdownTimer";
import OTPTextInput from "react-native-otp-textinput";
import { CreatedModal } from "../../components/ui/modals/CreatedModal";
import axios from "axios";

const SignUp = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [otp, setOTP] = useState("");
  const [confirmpin, setConfirmPin] = useState("");
  const [otpPage, setOtpPage] = useState(false);
  const [ispassWord, setispassWord] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clear, setClear] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isConfirmPass, setisConfirmPass] = useState<boolean>(false);
  const [states, setStates] = useState([]);
  const [pin, setPin] = useState("");
  const [capitals, setCapitals] = useState([]);
  const [loading, setLoading] = useState(true);
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
    axios
      .get("https://nigeria-states-towns-lga.onrender.com/api/states")
      .then((response) => {
        const statesData = response.data;
        setStates(statesData);
        const capitalsData = statesData.map((state: any) => state.capital);
        setCapitals(capitalsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleOtpPage = () => {
    setOtpPage(true);
  };

  const handleTimeout = () => {
    setIsTimedOut(true);
  };

  const handleOtpSubmit = () => {
    setispassWord(true);
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
  };

  const handleSubmitform = () => {
    setIsModalOpen(true);
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
                    <View className="h-[36px] flex justify-between items-center flex-row">
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
            <View className="h-auto w-full flex justify-start items-start">
              <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                Fill out the form to register.
              </Text>
              <View className=" w-full h-auto mt-3">
                <View className="my-2">
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    First Name
                  </Text>
                  <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={user} />
                    <TextInput
                      className="h-[50px] w-full rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
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
                    <Image source={user} />
                    <TextInput
                      className="h-[50px] rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
                      placeholder="Enter your Last Name"
                      placeholderTextColor="#999"
                      onChangeText={(text) =>
                        handleInputChange(text, "lastName")
                      }
                      value={formData.lastName}
                    />
                  </View>
                </View>
                <View className="my-2">
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    Location
                  </Text>
                  <View className="mt-2 relative border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={location} />
                    <CustomDropdown
                      options={capitals}
                      selectedValue={selectedValue}
                      onSelect={(value) => setSelectedValue(value)}
                    />
                    <Image source={dropdown} className="absolute right-3" />
                  </View>
                </View>
                <View className="my-2">
                  <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                    Phone number
                  </Text>
                  <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                    <Image source={phone} />
                    <TextInput
                      className="h-[50px] w-full rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
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
                    <Image source={email} />
                    <TextInput
                      className="h-[50px] w-full rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      onChangeText={(text) => handleInputChange(text, "email")}
                      value={formData.email}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View className="h-[38px] w-full flex justify-center flex-row gap-2 items-center">
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
                onPress={handleOtpPage}
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
      <CreatedModal isOpen={isModalOpen} closeModal={handleModalClose} />
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
