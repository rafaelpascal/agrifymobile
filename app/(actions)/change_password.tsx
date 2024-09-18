import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { change_pin, new_pin } from "../../utils/apiService";
import { ProductCreated } from "../../components/ui/modals/ProductCreated";
import { useUser } from "../../context/user-provider";
import { PINinput } from "../../components/ui/text-input/pin-input";
import OTPTextInput from "react-native-otp-textinput";
import CountdownTimer from "../../components/ui/display/CountdownTimer";
const back = require("../../assets/icon/goback.png");
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
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(tabs)">,
  BottomTabNavigationProp<TabParamList>
>;

const change_password = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const [pinchangedmodal, setPinchangedmodal] = useState(false);
  const [otpPage, setotpPage] = useState(false);
  const [otp, setOTP] = useState("");
  const [confirmpin, setConfirmPin] = useState("");
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isConfirmPass, setisConfirmPass] = useState<boolean>(false);
  const [clear, setClear] = useState(false);
  const [pin, setPin] = useState("");

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
  };

  const handleOTPChange = (otp: string) => {
    setOTP(otp);
  };

  const handleconfirmPinChange = (newPin: string) => {
    setConfirmPin(newPin);
  };

  const handleTimeout = () => {
    setIsTimedOut(true);
  };

  const handlePinSubmit = () => {
    setClear(true);
    setisConfirmPass(true);
  };

  const handleSendOtp = async () => {
    try {
      const marchantId = {
        marchantId: user,
      };
      const res = await change_pin(marchantId);
      if (res) {
        setotpPage(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changepin = async () => {
    try {
      const data = {
        otp: otp,
        marchantId: user,
        pin: confirmpin,
      };
      const newpin = await new_pin(data);
      if (newpin) {
        setPinchangedmodal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = () => {
    setisConfirmPass(false);
    setotpPage(false);
  };

  const handleModalClose = () => {
    setPinchangedmodal(false);
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
          <View className="w-full h-[90vh] px-3">
            {isConfirmPass ? (
              <>
                {otpPage ? (
                  <>
                    <View className="h-[80vh] w-full">
                      <TouchableOpacity
                        onPress={() => setotpPage(false)}
                        className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                      >
                        <Image source={back} />
                        <Text className="text-[14px] ml-2 p-0 text-[#2F2F2F] font-normal">
                          Go Back
                        </Text>
                      </TouchableOpacity>
                      <View className="mt-3 w-full">
                        <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                          Enter the code, sent to your phone.
                        </Text>
                        <View className="w-full mt-[10px]">
                          <Text className="mb-4 text-[14px] font-bold font-DMSans">
                            Input OTP received
                          </Text>
                          <OTPTextInput
                            inputCount={5}
                            handleTextChange={handleOTPChange}
                            containerStyle={{
                              marginBottom: 0,
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
                          <View className="h-[36px] flex justify-start items-center flex-row">
                            {isTimedOut === false && (
                              <Text className="mr-[2px]">Resend in</Text>
                            )}
                            <CountdownTimer
                              duration={120}
                              onTimeout={handleTimeout}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    <View className="w-full">
                      {otp.length !== 5 ? (
                        <TouchableOpacity className="h-[50px] w-[100%] bg- rounded-[4px] bg-themeGrey flex justify-center items-center">
                          <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                            Proceed
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={changepin}
                          className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                        >
                          <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                            Proceed
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <View className="h-[80vh] w-full">
                      <TouchableOpacity
                        onPress={() => setisConfirmPass(false)}
                        className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                      >
                        <Image source={back} />
                        <Text className="text-[14px] ml-2 p-0 text-[#2F2F2F] font-normal">
                          Go Back
                        </Text>
                      </TouchableOpacity>
                      <View className="mt-3 w-full">
                        <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                          Change PIN
                        </Text>
                        <View className="w-full mt-[10px]">
                          <Text className="mb-4 text-[14px] font-bold font-DMSans">
                            Confirm Pin
                          </Text>
                          <PINinput
                            length={4}
                            onChange={handleconfirmPinChange}
                            clear={clear}
                          />
                          <View className="w-full h-[30px] mt-4 ">
                            {pin === confirmpin && (
                              <Text className="text-[16px] font-bold font-DMSans text-themeGreen">
                                Pin match
                              </Text>
                            )}
                            {confirmpin.length === 4 && pin !== confirmpin && (
                              <Text className="text-[16px] font-bold font-DMSans text-themeDanger">
                                Pin Doesn't match
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    <View className="w-full">
                      {pin !== confirmpin ? (
                        <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
                          <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                            Done
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                        >
                          <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                            Done
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <View className="h-[80vh] w-full">
                  <TouchableOpacity
                    onPress={handleGoback}
                    className="bg-themeGreen/10 w-[78px] mb-3 h-[35px] flex justify-center items-center flex-row rounded-md"
                  >
                    <Image source={back} />
                    <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
                      Go Back
                    </Text>
                  </TouchableOpacity>
                  <View className="mt-3 w-full">
                    <Text className="text-[24px] font-bold text-[#343434] font-DMSans">
                      Change PIN
                    </Text>
                    <View className="w-full mt-[10px]">
                      <Text className="mb-4 text-[14px] font-bold font-DMSans">
                        Please enter your new PIN
                      </Text>
                      <PINinput
                        length={4}
                        onChange={handlePinChange}
                        clear={clear}
                      />
                    </View>
                  </View>
                </View>
                <View className="w-full">
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
              </>
            )}
          </View>
        </ScrollView>
        <ProductCreated
          userId="Your PIN has been changed successfully."
          isOpen={pinchangedmodal}
          handleContinue={handleContinue}
          closeModal={handleModalClose}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default change_password;
