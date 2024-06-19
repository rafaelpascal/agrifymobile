import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
import { DashboardCardRow } from "../../components/grouped-components/dashboard-card-row";
import { DashboardCardProps } from "../../components/ui/dashboardCard/dashboardCard";
import { CustomDropdown } from "../../components/ui/text-input/select-input";
import { BaseItem } from "../../components/ui/product/listing";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProductCreated } from "../../components/ui/modals/ProductCreated";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const plus = require("../../assets/images/plus.png");
const back = require("../../assets/icon/goback.png");
const dropdown = require("../../assets/icon/dropdown.png");

const items = [
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Irish Potatoes",
    qty: "5 baskets",
    status: false,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Sweet Potatoes",
    qty: "20 baskets",
    status: true,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Yam",
    qty: "3 baskets",
    status: true,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Irish Potatoes",
    qty: "5 baskets",
    status: false,
    value: 200,
  },
];

export default function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [iscameraActive, setisCameraActive] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [currentQty, setcurrentQty] = useState("");
  const [inputs, setInputs] = useState([{ quantity: "", price: "" }]);
  const [productName, setproductName] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isNewpicture, setisNewpicture] = useState(false);
  const [isFirstcapture, setFirstCapture] = useState(false);
  const [isreview, setPreview] = useState(false);
  const cameraRef = useRef<any>(null);
  const [isViewImage, setIsViewImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null | any>(null);
  const [dashboardHeroCards, setDashboardHeroCards] = useState<
    DashboardCardProps[]
  >([
    {
      icon: product,
      title: "Total Product",
      value: "0",
    },
    {
      icon: sales,
      title: "Total Sales",
      value: "3000",
    },
    {
      icon: stock,
      title: "Stock Left",
      value: "0",
    },
  ]);

  const handleInputChange = (
    index: number | any,
    name: string,
    value: string | { value: string; label: string } | null
  ) => {
    let newValue: string | null;
    if (typeof value === "object" && value !== null) {
      newValue = value.value;
      setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
    } else {
      newValue = value;
    }

    const newInputs = inputs.map((input, i) =>
      i === index ? { ...input, [name]: newValue } : input
    );
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { quantity: "", price: "" }]);
  };
  const handlecurrQty = (text: string) => {
    setcurrentQty(text);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImages([...capturedImages, photo.uri]);
      // setisNewpicture(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsViewImage(true);
  };

  const closeImageView = () => {
    setSelectedImage(null);
    setIsViewImage(false);
  };

  const handlePreviewPage = () => {
    setPreview(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const lastInput = inputs[inputs.length - 1];
  return (
    <>
      <StatusBar style="auto" hidden={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <DashboardArea title={`Welcome Raphael`}>
          {isNewProduct ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {isreview ? (
                  <View className="w-full relative h-[70vh]">
                    <TouchableOpacity
                      onPress={() => setPreview(false)}
                      className="bg-themeGreen/10 w-[78px] h-[35px] flex justify-center items-center flex-row rounded-md"
                    >
                      <Image source={back} />
                      <Text className="text-[#435060] ml-1 text-[12px] font-DMSans font-normal">
                        Go Back
                      </Text>
                    </TouchableOpacity>
                    <View className="h-[52px] w-full my-4">
                      <Text className="text-[20px] mb-1 font-bold font-DMSans text-[#25313E]">
                        Review your product detail
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between w-full items-center h-[27px]">
                      <Text className="text-[12px] font-DMSans font-bold text-[#25313E]">
                        Product Information
                      </Text>
                      <TouchableOpacity className="flex flex-row justify-center items-center">
                        <AntDesign name="edit" size={20} color="#415BE6" />
                        <Text className="text-[12px] ml-1 font-DMSans font-bold text-[#415BE6]">
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="h-auto w-full rounded-[12px] bg-[#F5F6FB] border-[1px] border-[#E6E6E8] my-[12px] p-[12px]">
                      <View className="flex flex-row justify-between w-full items-center h-[27px]">
                        <Text className="text-[12px] font-DMSans font-normal text-[#435060]">
                          Product Category
                        </Text>
                        <Text className="text-[12px] font-DMSans font-bold text-[#25313E]">
                          {selectedValue}
                        </Text>
                      </View>
                      <View className="flex flex-row justify-between w-full items-center h-[27px]">
                        <Text className="text-[12px] font-DMSans font-normal text-[#435060]">
                          Product Name
                        </Text>
                        <Text className="text-[12px] font-DMSans font-bold text-[#25313E]">
                          {productName}
                        </Text>
                      </View>
                      <View className="flex flex-row justify-between w-full items-center h-[27px]">
                        <Text className="text-[12px] font-DMSans font-normal text-[#435060]">
                          Product Quantity
                        </Text>
                        {inputs.map((input, index) => (
                          <Text
                            key={index}
                            className="text-[12px] font-DMSans font-bold text-[#25313E]"
                          >
                            {input.quantity}
                          </Text>
                        ))}
                      </View>

                      <View className="flex flex-row justify-between w-full items-center h-[27px]">
                        <Text className="text-[12px] font-DMSans font-normal text-[#435060]">
                          Product Image
                        </Text>
                        <View className="rounded-lg w-[36px] h-[29px]">
                          {capturedImages.map((image, index) => (
                            <ImageBackground
                              key={index}
                              source={{ uri: image }}
                              className="w-full absolute top-0 left-0 justify-center items-center h-full rounded-lg z-0 overflow-hidden "
                            >
                              <Text className="text-[16px] font-DMSans font-bold text-[#FFF]">
                                +{capturedImages.length}
                              </Text>
                            </ImageBackground>
                          ))}
                        </View>
                      </View>
                    </View>
                    {/*  */}
                    <View className="flex flex-row justify-between w-full items-center h-[27px]">
                      <Text className="text-[12px] font-DMSans font-bold text-[#25313E]">
                        Pricing & Quantity
                      </Text>
                      <TouchableOpacity className="flex flex-row justify-center items-center">
                        <AntDesign name="edit" size={20} color="#415BE6" />
                        <Text className="text-[12px] ml-1 font-DMSans font-bold text-[#415BE6]">
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="h-auto w-full rounded-[12px] bg-[#F5F6FB] border-[1px] border-[#E6E6E8] my-[12px] p-[12px]">
                      <View className="flex flex-row justify-between w-full items-center h-[27px]">
                        <Text className="text-[12px] font-DMSans font-normal text-[#435060]">
                          Product Price
                        </Text>
                        {inputs.map((input, index) => (
                          <Text
                            key={index}
                            className="text-[12px] font-DMSans font-bold text-[#25313E]"
                          >
                            {input.price}
                          </Text>
                        ))}
                      </View>
                      <View className="flex flex-row justify-between w-full items-center h-[27px]">
                        <Text className="text-[12px] font-DMSans font-normal text-[#435060]">
                          How many tubers do you have in stock?
                        </Text>
                        <Text className="text-[12px] font-DMSans font-bold text-[#25313E]">
                          {currentQty}
                        </Text>
                      </View>
                    </View>
                    <View className="absolute bottom-0 flex flex-row justify-between items-center">
                      <TouchableOpacity
                        onPress={() => setPreview(false)}
                        className="h-[50px] w-[49%] border-[1px] bg-transparent border-themeGreen rounded-[4px] flex justify-center items-center"
                      >
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-themeGreen">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="h-[50px] w-[49%] bg-themeGreen rounded-[4px] flex justify-center items-center">
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ProductCreated
                      isOpen={isModalOpen}
                      closeModal={handleModalClose}
                    />
                  </View>
                ) : (
                  <>
                    {iscameraActive ? (
                      <View className="w-full h-full pb-[30%]">
                        <TouchableOpacity
                          onPress={() => setisCameraActive(false)}
                          className="bg-themeGreen/10 w-[78px] h-[35px] flex justify-center items-center flex-row rounded-md"
                        >
                          <Image source={back} />
                          <Text className="text-[#435060] ml-1 text-[12px] font-DMSans font-normal">
                            Go Back
                          </Text>
                        </TouchableOpacity>
                        <View className="h-[52px] w-full my-4">
                          <Text className="text-[20px] mb-1 font-bold font-DMSans text-[#25313E]">
                            Product image
                          </Text>
                          <View className="h-[26px] w-full bg-themeGreen/10 flex justify-center items-center px-2 rounded-[4px]">
                            <Text className="text-[14px] font-normal font-DMSans text-themeGreen">
                              Take a picture of the product you have for sale.
                            </Text>
                          </View>
                        </View>
                        <View className="h-auto w-full">
                          <View className="pb-[10%] h-full">
                            <View className="w-full h-full">
                              {isFirstcapture ? (
                                <View className="flex flex-col w-full h-[400px]">
                                  <>
                                    {isNewpicture &&
                                    capturedImages.length > 0 ? (
                                      <View className="w-full">
                                        {isViewImage ? (
                                          <View>
                                            <ImageBackground
                                              source={{ uri: selectedImage }}
                                              className="w-full h-[400px] rounded-lg overflow-hidden relative z-0"
                                            >
                                              <TouchableOpacity
                                                onPress={closeImageView}
                                                className="absolute right-0"
                                              >
                                                <MaterialIcons
                                                  name="highlight-remove"
                                                  size={24}
                                                  color="white"
                                                />
                                              </TouchableOpacity>
                                            </ImageBackground>
                                          </View>
                                        ) : (
                                          <CameraView
                                            className="h-[400px]"
                                            facing={facing}
                                            ref={cameraRef}
                                          >
                                            <View className="relative h-full">
                                              <TouchableOpacity
                                                className="absolute right-4 top-2"
                                                onPress={toggleCameraFacing}
                                              >
                                                <MaterialIcons
                                                  name="flip-camera-ios"
                                                  size={44}
                                                  color="white"
                                                />
                                              </TouchableOpacity>
                                              <TouchableOpacity
                                                className="absolute bottom-0 left-[40%]"
                                                onPress={captureImage}
                                              >
                                                <MaterialCommunityIcons
                                                  name="camera-iris"
                                                  size={54}
                                                  color="white"
                                                />
                                              </TouchableOpacity>
                                            </View>
                                          </CameraView>
                                        )}
                                        <View className="flex flex-row rounded-lg justify-start items-center mt-4">
                                          {capturedImages.map(
                                            (image, index) => (
                                              <TouchableOpacity
                                                key={index}
                                                onPress={() =>
                                                  handleImageClick(image)
                                                }
                                              >
                                                <ImageBackground
                                                  key={index}
                                                  source={{ uri: image }}
                                                  className="w-[60px] h-[60px] ml-2 rounded-lg overflow-hidden relative z-0"
                                                >
                                                  <TouchableOpacity
                                                    onPress={() =>
                                                      handleImageRemove(index)
                                                    }
                                                    className="absolute right-0"
                                                  >
                                                    <MaterialIcons
                                                      name="highlight-remove"
                                                      size={24}
                                                      color="white"
                                                    />
                                                  </TouchableOpacity>
                                                </ImageBackground>
                                              </TouchableOpacity>
                                            )
                                          )}
                                        </View>
                                      </View>
                                    ) : (
                                      <>
                                        {capturedImages.length > 0 ? (
                                          <View className="flex flex-col w-full rounded-lg justify-center items-center">
                                            <View className="relative rounded-lg w-full h-full pt-8">
                                              {capturedImages.map(
                                                (image, index) => (
                                                  <ImageBackground
                                                    key={index}
                                                    source={{ uri: image }}
                                                    className="w-full h-full rounded-lg z-0 overflow-hidden "
                                                  >
                                                    <TouchableOpacity
                                                      onPress={() =>
                                                        handleImageRemove(index)
                                                      }
                                                      className="absolute right-2 top-2 z-20"
                                                    >
                                                      <MaterialIcons
                                                        name="cancel"
                                                        size={34}
                                                        color="white"
                                                      />
                                                    </TouchableOpacity>
                                                  </ImageBackground>
                                                )
                                              )}
                                            </View>
                                            <TouchableOpacity
                                              className="w-full h-[44px] border-[1px] border-dashed border-[#6D9EFF] rounded-[4px] flex justify-center items-center flex-row mt-4"
                                              onPress={() =>
                                                setisNewpicture(true)
                                              }
                                            >
                                              <FontAwesome6
                                                name="plus"
                                                size={24}
                                                color="#6D9EFF"
                                              />
                                              <Text className="text-[14px] text-[#6D9EFF] ml-2 font-DMSans font-bold">
                                                Add another image
                                              </Text>
                                            </TouchableOpacity>
                                          </View>
                                        ) : (
                                          <View className="flex flex-1 justify-center">
                                            <CameraView
                                              className="h-[400px]"
                                              facing={facing}
                                              ref={cameraRef}
                                            >
                                              <View className="relative h-full">
                                                <TouchableOpacity
                                                  className="absolute right-4 top-2"
                                                  onPress={toggleCameraFacing}
                                                >
                                                  <MaterialIcons
                                                    name="flip-camera-ios"
                                                    size={44}
                                                    color="white"
                                                  />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                  className="absolute bottom-0 left-[40%]"
                                                  onPress={captureImage}
                                                >
                                                  <MaterialCommunityIcons
                                                    name="camera-iris"
                                                    size={54}
                                                    color="white"
                                                  />
                                                </TouchableOpacity>
                                              </View>
                                            </CameraView>
                                          </View>
                                        )}
                                      </>
                                    )}
                                  </>
                                </View>
                              ) : (
                                <View>
                                  <TouchableOpacity
                                    className="w-full h-[69px] bg-[#6D9EFF]/10 rounded-[4px] flex justify-center items-center flex-row"
                                    onPress={() => setFirstCapture(true)}
                                  >
                                    <MaterialIcons
                                      name="photo-camera"
                                      size={30}
                                      color="#6D9EFF"
                                    />
                                    <Text className="text-[13px] text-[#6D9EFF] ml-1 font-DMSans font-bold">
                                      Take a photo or Upload
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                            {capturedImages.length === 0 ? (
                              <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
                                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                                  Save
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={handlePreviewPage}
                                className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                              >
                                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                                  Save
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity
                          onPress={() => setIsNewProduct(false)}
                          className="bg-themeGreen/10 w-[78px] h-[35px] flex justify-center items-center flex-row rounded-md"
                        >
                          <Image source={back} />
                          <Text className="text-[#435060] ml-1 text-[12px] font-DMSans font-normal">
                            Go Back
                          </Text>
                        </TouchableOpacity>
                        <View className="my-4">
                          <Text className="text-[20px] font-bold font-DMSans text-[#25313E]">
                            Add new item
                          </Text>
                          <Text className="text-[12px] font-normal font-DMSans text-[#8F94A8] mt-1">
                            Add a product you would like to sale in your shop.
                          </Text>
                        </View>
                        <View className="my-2">
                          <Text className="text-[12px] font-semibold text-[#343434] font-DMSans">
                            Product Category
                          </Text>
                          <View
                            className={`mt-2 px-3 flex flex-row rounded-[8px] justify-start items-center rounded-[4px], ${
                              selectedValue
                                ? "border-[1px] border-themeGreen"
                                : "border-[1px] border-[#A9A9A9]"
                            }`}
                          >
                            <CustomDropdown
                              options={[
                                "Tubers",
                                "Grains",
                                "Fruits",
                                "Livestock",
                                "Egg",
                                "Vegetables",
                              ]}
                              placeholder="Select a Category"
                              InputClass="top-[36%]"
                              selectedValue={selectedValue}
                              isLoading={loading}
                              onSelect={(value) => setSelectedValue(value)}
                            />
                            <Image
                              source={dropdown}
                              className="absolute right-3"
                            />
                          </View>
                        </View>
                        {selectedValue && (
                          <View className="my-2">
                            <Text className="text-[12px] font-semibold text-[#343434] font-DMSans">
                              Product Name
                            </Text>
                            <View
                              className={`mt-2 px-3 flex flex-row rounded-[8px] justify-start items-center rounded-[4px], ${
                                productName
                                  ? "border-[1px] border-themeGreen"
                                  : "border-[1px] border-[#A9A9A9]"
                              }`}
                            >
                              <CustomDropdown
                                options={[
                                  "Yam",
                                  "Cassava",
                                  "Rice",
                                  "Sweet Potatoes",
                                  "Irish potatoes",
                                  "Ugu",
                                ]}
                                placeholder="Select your product"
                                InputClass="top-[47%]"
                                selectedValue={productName}
                                isLoading={loading}
                                onSelect={(value) => setproductName(value)}
                              />
                              <Image
                                source={dropdown}
                                className="absolute right-3"
                              />
                            </View>
                          </View>
                        )}
                        {productName && (
                          <View className="my-2">
                            <Text className="text-[12px] font-semibold text-[#343434] font-DMSans">
                              Pricing (Enter the price of your product)
                            </Text>
                            <View className="w-full border-[1px] border-[#dddfe6] bg-[#E6E6E8] py-[18px] px-2 rounded-[18px] mt-4">
                              {inputs.map((input, index) => (
                                <View
                                  key={index}
                                  className="flex flex-row mt-2 w-full justify-between items-center "
                                >
                                  <View className="w-[50%]">
                                    <Text className="text-[12px] font-semibold font-DMSans text-[#25313E] mb-2">
                                      Product Quantity
                                    </Text>
                                    <View
                                      className={`px-2 flex justify-center flex-row items-center rounded-[4px] w-[98%] rounded-[4px], ${
                                        input.quantity
                                          ? "border-[1px] border-themeGreen bg-[#00A45F]/10 "
                                          : "border-[1px] border-[#A9A9A9] bg-white "
                                      }`}
                                    >
                                      <CustomDropdown
                                        options={[
                                          "1-9pc",
                                          "10-19pc",
                                          "20-29pc",
                                          "30-39pc",
                                          "40-49pc",
                                          "50-100pc",
                                        ]}
                                        placeholder="Select Quantity"
                                        InputClass="top-[63%]"
                                        isLoading={loading}
                                        selectedValue={input.quantity}
                                        onSelect={(value) =>
                                          handleInputChange(
                                            index,
                                            "quantity",
                                            value
                                          )
                                        }
                                      />
                                      <Image source={dropdown} />
                                    </View>
                                  </View>

                                  <View className="w-[50%]">
                                    <Text className="text-[12px] font-semibold font-DMSans text-[#25313E] mb-2">
                                      Product Price
                                    </Text>
                                    <View
                                      className={`px-3 rounded-[4px] w-[98%] rounded-[4px], ${
                                        input.price
                                          ? "border-[1px] border-themeGreen bg-[#00A45F]/10 "
                                          : "border-[1px] border-[#A9A9A9] bg-white "
                                      }`}
                                    >
                                      <TextInput
                                        className="h-[50px] rounded-[4px] px-3 text-[#25313E] text-[13px] font-bold font-DMSans"
                                        placeholder="Enter your price"
                                        placeholderTextColor="#999"
                                        value={input.price}
                                        keyboardType="numeric"
                                        onChangeText={(text) =>
                                          handleInputChange(
                                            index,
                                            "price",
                                            text
                                          )
                                        }
                                      />
                                    </View>
                                  </View>
                                </View>
                              ))}
                            </View>
                            <TouchableOpacity
                              onPress={handleAddInput}
                              className="font-semibold mt-4 bg-themeGreen/10 text-themeGreen w-full flex justify-center items-center h-[50px] rounded-[4px] border-[0.5px] border-themeGreen"
                            >
                              <Text className="text-[13px]"> Add more</Text>
                            </TouchableOpacity>
                            <View className="my-2">
                              <Text className="text-[12px] font-normal text-[#343434] font-DMSans">
                                How many tubers do you have in stock?
                              </Text>
                              <View className="mt-2 border-[1px] px-3 flex flex-row justify-start items-center border-[#A9A9A9] rounded-[4px]">
                                <TextInput
                                  className="h-[50px] rounded-[4px] px-3 text-[#A9A9A9] text-[13px] font-semibold font-DMSans"
                                  placeholder="Enter the current quantity"
                                  placeholderTextColor="#999"
                                  keyboardType="numeric"
                                  onChangeText={handlecurrQty}
                                  value={currentQty}
                                />
                              </View>
                            </View>
                            {currentQty === "" ? (
                              <TouchableOpacity className="h-[50px] w-[100%] bg-[#E2E2E2] rounded-[4px] flex justify-center items-center">
                                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                                  Next
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => setisCameraActive(true)}
                                className="h-[50px] w-[100%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                              >
                                <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                                  Next
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <View className="flex h-full items-center justify-start w-full rounded-[8px]">
              <StatusBar style="auto" hidden={false} />
              <DashboardCardRow dashboardHeroCards={dashboardHeroCards} />
              <View className="w-full my-6">
                <TouchableOpacity
                  onPress={() => setIsNewProduct(true)}
                  className="h-[38px] flex-row bg-themeGreen rounded-[4px] flex justify-center items-center w-full"
                >
                  <Image source={plus} />
                  <Text className="text-themeGrey ml-2 text-[14px] font-semibold font-DMSans">
                    Add Product to shop
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <View className="flex flex-row justify-between items-start w-full">
                  <Text className="text-[14px] font-semibold font-DMSans ">
                    Transaction History
                  </Text>
                  <Text className="text-[#8F94A8] text-[14px] font-semibold font-DMSans ">
                    (1290)
                  </Text>
                </View>
                <View className="flex h-auto flex-col w-full justify-center items-start">
                  <Text className="mt-2 text-[12px] text-[#8F94A8] font-DMSans font-normal">
                    Today
                  </Text>
                  {items.map((item, index) => (
                    <BaseItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      qty={item.qty}
                      status={item.status}
                      value={item.value}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </DashboardArea>
      </KeyboardAvoidingView>
    </>
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
