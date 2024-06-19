import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { DashboardArea } from "@/components/ui/layout/dashboard/DashboardArea";
import { CustomDropdown } from "../../components/ui/text-input/select-input";
import { AntDesign } from "@expo/vector-icons";
import { PINinput } from "../../components/ui/text-input/pin-input";
const changePin = require("../../assets/icon/lock.png");
const payment = require("../../assets/icon/moneys.png");
const notification = require("../../assets/icon/notification.png");
const support = require("../../assets/icon/messages.png");
const logout = require("../../assets/icon/logout.png");
const user = require("../../assets/icon/user1.png");
const location = require("../../assets/icon/location.png");
const dropdown = require("../../assets/icon/dropdown.png");
const phone = require("../../assets/icon/phone.png");
const email = require("../../assets/icon/email.png");
const back = require("../../assets/icon/goback.png");
import axios from "axios";

export default function personalsettings() {
  const [buttonClicked, setbuttonClicked] = useState(false);
  const [confirmpin, setConfirmPin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectDropdown, setisSelectDropdown] = useState(false);
  const [isConfirmPass, setisConfirmPass] = useState<boolean>(false);
  const [isPersonalInfo, setisPersonalInfo] = useState(false);
  const [isChangePin, setisChangePin] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [clear, setClear] = useState(false);
  const [capitals, setCapitals] = useState([]);
  const [states, setStates] = useState([]);
  const [pin, setPin] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

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

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
  };
  const handlepersonalInfo = () => {
    setbuttonClicked(true);
    setisPersonalInfo(true);
  };
  const handleChangepin = () => {
    setbuttonClicked(true);
    setisChangePin(true);
  };

  const handleconfirmPinChange = (newPin: string) => {
    setConfirmPin(newPin);
  };

  const handlePinSubmit = () => {
    setClear(true);
    setisConfirmPass(true);
  };

  const handleSubmitform = () => {
    setIsModalOpen(true);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        {buttonClicked ? (
          <>
            {isPersonalInfo && (
              <View className="h-full w-full">
                <TouchableOpacity
                  onPress={() => {
                    setbuttonClicked(false);
                    setisPersonalInfo(false);
                  }}
                  className="bg-themeGreen/10 w-[78px] mb-3 h-[35px] flex justify-center items-center flex-row rounded-md"
                >
                  <Image source={back} />
                  <Text className="text-[#435060] ml-1 text-[12px] font-DMSans font-normal">
                    Go Back
                  </Text>
                </TouchableOpacity>
                <Text className="font-bold text-[20px] h-[44px] font-DMSans text-[#25313E]">
                  Personal Information
                </Text>
                <View className=" w-full h-auto mt-3">
                  <View className="my-2">
                    <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                      First Name
                    </Text>
                    <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center bg-[#F5F6FB] border-[#A9A9A9] rounded-[4px]">
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
                    <View className="mt-2 border-[1px] px-3 flex flex-row justify-start bg-[#F5F6FB] items-center border-[#A9A9A9] rounded-[4px]">
                      <Image source={user} />
                      <TextInput
                        className="h-[50px] rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
                        placeholder="Enter your Last Name"
                        placeholderTextColor="#999"
                        readOnly={true}
                        onChangeText={(text) =>
                          handleInputChange(text, "lastName")
                        }
                        value={formData.lastName}
                      />
                    </View>
                  </View>
                  <View className="my-2">
                    <TouchableOpacity
                      onPress={() => setisSelectDropdown(!isSelectDropdown)}
                      className="text-[12px] font-normal text-[#343434] font-DMSans"
                    >
                      <Text>Location</Text>
                    </TouchableOpacity>
                    <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center bg-[#F5F6FB] border-[#A9A9A9] rounded-[4px]">
                      <Image source={location} />
                      <CustomDropdown
                        InputClass="top-[52%]"
                        isLoading={loading}
                        options={states}
                        selectedValue={selectedValue}
                        placeholder="Select Location"
                        onSelect={(value) => setSelectedValue(value)}
                      />
                      <Image source={dropdown} className="absolute right-3" />
                    </View>
                  </View>
                  <View className="my-2">
                    <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                      Phone number
                    </Text>
                    <View className="mt-2 border-[1px] px-3 flex flex-row justify-start bg-[#F5F6FB] items-center border-[#A9A9A9] rounded-[4px]">
                      <Image source={phone} />
                      <TextInput
                        className="h-[50px] w-full rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
                        placeholder="Enter your phone number"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        readOnly={true}
                        onChangeText={(text) =>
                          handleInputChange(text, "phone")
                        }
                        value={formData.phone}
                      />
                    </View>
                  </View>
                  <View className="mt-2">
                    <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                      Email (Optional)
                    </Text>
                    <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center bg-[#F5F6FB] border-[#A9A9A9] rounded-[4px]">
                      <Image source={email} />
                      <TextInput
                        className="h-[50px] w-full rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        readOnly={true}
                        onChangeText={(text) =>
                          handleInputChange(text, "email")
                        }
                        value={formData.email}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
            {/* Change Pin */}
            {isChangePin && (
              <View className="h-full w-full">
                {isConfirmPass ? (
                  <View className="relative h-full w-full">
                    <TouchableOpacity
                      onPress={() => setisConfirmPass(false)}
                      className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                    >
                      <Image source={back} />
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
                    <View className="absolute bottom-0 w-full">
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
                  </View>
                ) : (
                  <View className="relative h-full w-full">
                    <TouchableOpacity
                      onPress={() => {
                        setbuttonClicked(false);
                        setisChangePin(false);
                      }}
                      className="bg-themeGreen/10 w-[78px] mb-3 h-[35px] flex justify-center items-center flex-row rounded-md"
                    >
                      <Image source={back} />
                      <Text className="text-[#435060] ml-1 text-[12px] font-DMSans font-normal">
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
                    <View className="absolute bottom-0 w-full">
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
                  </View>
                )}
              </View>
            )}
          </>
        ) : (
          <View className="h-full w-full">
            <Text className="font-bold text-[20px] h-[44px] font-DMSans text-[#25313E]">
              Setting
            </Text>
            <View className="w-full">
              <TouchableOpacity
                onPress={handlepersonalInfo}
                className="h-[65px] flex flex-row justify-between items-center w-full"
              >
                <View className="flex flex-row justify-start items-center">
                  <Image source={user} />
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
              <TouchableOpacity className="h-[65px] flex flex-row justify-between items-center w-full">
                <View className="flex flex-row justify-start items-center">
                  <Image source={payment} />
                  <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                    Payment
                  </Text>
                </View>
                <AntDesign name="right" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity className="h-[65px] flex flex-row justify-between items-center w-full">
                <View className="flex flex-row justify-start items-center">
                  <Image source={notification} />
                  <Text className="font-semibold text-[14px] ml-2 font-DMSans text-[#25313E]">
                    Notifications
                  </Text>
                </View>
                <AntDesign name="right" size={20} color="black" />
              </TouchableOpacity>
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
              <TouchableOpacity className="h-[65px] flex flex-row justify-between items-center w-full">
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
        )}
      </DashboardArea>
    </KeyboardAvoidingView>
  );
}
