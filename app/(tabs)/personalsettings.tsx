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
const location = require("../../assets/icon/location.png");
const dropdown = require("../../assets/icon/dropdown.png");
const phone = require("../../assets/icon/phone.png");
const email = require("../../assets/icon/email.png");
const back = require("../../assets/icon/goback.png");
const check = require("../../assets/icon/check.png");
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
const search = require("../../assets/icon/search.png");
import axios from "axios";

interface Bank {
  code: string;
  logo: string;
  name: string;
  slug: string;
  ussd: string;
}

export default function personalsettings() {
  const { user } = useUser();
  const [buttonClicked, setbuttonClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pinchangedmodal, setPinchangedmodal] = useState(false);
  const [otpPage, setotpPage] = useState(false);
  const [otp, setOTP] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [isselected, setIsselected] = useState(false);
  const [confirmpin, setConfirmPin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectDropdown, setisSelectDropdown] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isConfirmPass, setisConfirmPass] = useState<boolean>(false);
  const [isPersonalInfo, setisPersonalInfo] = useState(false);
  const [isPayment, setisPayment] = useState(false);
  const [bankverified, setbankverified] = useState(false);
  const [isChangePin, setisChangePin] = useState(false);
  const [isfailed, setisfailed] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [stateselectedValue, setStateSelectedValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bankloading, setBankLoading] = useState(false);
  const [clear, setClear] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [pin, setPin] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "",
  });
  const [bankData, setBankData] = useState({
    accountnumber: "",
  });
  const [userBank, setuserBank] = useState({
    account_number: "",
    account_name: "",
  });

  const handleInputChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };
  const handlebankDataInput = (value: string, name: string) => {
    setBankData({ ...bankData, [name]: value });
  };

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
  };

  const handleOTPChange = (otp: string) => {
    setOTP(otp);
  };
  const handlepersonalInfo = () => {
    setbuttonClicked(true);
    setisPersonalInfo(true);
  };
  const handleChangepin = () => {
    setbuttonClicked(true);
    setisChangePin(true);
  };
  const handlePayment = () => {
    setbuttonClicked(true);
    setisPayment(true);
  };

  const handleContinue = () => {
    setbuttonClicked(false);
    setisChangePin(false);
    setisPayment(false);
    setisConfirmPass(false);
    setotpPage(false);
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

  useEffect(() => {
    fetchStates();
  }, []);

  const filteredOptions = banks.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const locatiofiltered = states.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setisfailed(false);
    setbankverified(false);
    setIsselected(true);
    setSelectedValue(value);
    setisSelectDropdown(false);
  };

  const handlestateSelect = (value: string) => {
    setStateSelectedValue(value);
    setModalVisible(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsAccModalOpen(false);
    setPinchangedmodal(false);
  };

  const handleLogout = () => {
    setIsModalOpen(true);
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

  const handleEdit = () => {
    setIsReadOnly(false);
    setEdit(true);
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

  //
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        <View className="h-[70vh]">
          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
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
                            onChangeText={(text) =>
                              handleInputChange(text, "firstName")
                            }
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
                            onChangeText={(text) =>
                              handleInputChange(text, "lastName")
                            }
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
                            <Image
                              source={dropdown}
                              className="absolute right-3"
                            />
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
                            <Image
                              source={dropdown}
                              className="absolute right-3"
                            />
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
                                      onChangeText={(text) =>
                                        setSearchQuery(text)
                                      }
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
                                          onPress={() =>
                                            handlestateSelect(option)
                                          }
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
                            onChangeText={(text) =>
                              handleInputChange(text, "phone")
                            }
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
                            onChangeText={(text) =>
                              handleInputChange(text, "email")
                            }
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
                )}
                {isChangePin && (
                  <View className="w-full">
                    {isConfirmPass ? (
                      <>
                        {otpPage ? (
                          <>
                            <TouchableOpacity
                              onPress={() => setotpPage(false)}
                              className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                            >
                              <Image source={back} />
                              <Text className="text-[14px] ml-2 p-0 text-[#2F2F2F] font-normal">
                                Go Back
                              </Text>
                            </TouchableOpacity>
                            <View className="h-[65vh] w-full">
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
                          </>
                        ) : (
                          <View className="h-full w-full">
                            <TouchableOpacity
                              onPress={() => setisConfirmPass(false)}
                              className="bg-themeGreen/10 border-[1px] border-themeGreen w-[78px] h-[35px] flex flex-row items-center justify-center rounded-[8px]"
                            >
                              <Image source={back} />
                              <Text className="text-[14px] ml-2 p-0 text-[#2F2F2F] font-normal">
                                Go Back
                              </Text>
                            </TouchableOpacity>
                            <View className="h-[65vh] w-full">
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
                          </View>
                        )}
                      </>
                    ) : (
                      <View className="h-full w-full">
                        <TouchableOpacity
                          onPress={() => {
                            setbuttonClicked(false);
                            setisChangePin(false);
                          }}
                          className="bg-themeGreen/10 w-[78px] mb-3 h-[35px] flex justify-center items-center flex-row rounded-md"
                        >
                          <Image source={back} />
                          <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
                            Go Back
                          </Text>
                        </TouchableOpacity>
                        <View className="h-[65vh] w-full">
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
                      </View>
                    )}
                  </View>
                )}
                {isPayment && (
                  <View className="h-full relative w-full">
                    <TouchableOpacity
                      onPress={() => {
                        setbuttonClicked(false);
                        setisPayment(false);
                      }}
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
                    <View className=" w-full h-auto mt-3 z-10">
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
                          <Image
                            source={dropdown}
                            className="absolute right-3"
                          />
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
                                      onChangeText={(text) =>
                                        setSearchQuery(text)
                                      }
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
                                      <ActivityIndicator
                                        size="large"
                                        color="#00A45F"
                                      />
                                    </View>
                                  ) : (
                                    <ScrollView className="flex-grow">
                                      {filteredOptions.map((option, index) => (
                                        <TouchableOpacity
                                          key={index}
                                          className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                                          onPress={() =>
                                            handleSelect(option.name)
                                          }
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
                              <MaterialIcons
                                name="cancel"
                                size={24}
                                color="#F64B4B"
                              />
                              <View className="w-[90%]">
                                <Text className="font-DMSans ml-2 text-[16px] text-themeDanger font-bold">
                                  Account verification Failed. check the details
                                  or try again Later.
                                </Text>
                              </View>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                    <View className="absolute bottom-0 z-0 pt-4 w-full">
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
                      <Image source={usersvg} />
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
                  <TouchableOpacity
                    onPress={handlePayment}
                    className="h-[65px] flex flex-row justify-between items-center w-full"
                  >
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
                  <TouchableOpacity
                    onPress={handleLogout}
                    className="h-[65px] flex flex-row justify-between items-center w-full"
                  >
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
          </ScrollView>
          <LogoutModal
            userId=""
            isOpen={isModalOpen}
            closeModal={handleModalClose}
          />
          <ProductCreated
            userId={message}
            isOpen={isAccModalOpen}
            handleContinue={handleContinue}
            closeModal={handleModalClose}
          />
          <ProductCreated
            userId="Your PIN has been changed successfully."
            isOpen={pinchangedmodal}
            handleContinue={handleContinue}
            closeModal={handleModalClose}
          />
        </View>
      </DashboardArea>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 0,
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
