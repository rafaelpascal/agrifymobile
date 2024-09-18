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
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DashboardCardProps } from "../../components/ui/dashboardCard/dashboardCard";
import {
  marchant_acc,
  new_product,
  all_product,
  categories,
  product_names,
  get_previous_sales,
  get_all_order,
} from "../../utils/apiService";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProductCreated } from "../../components/ui/modals/ProductCreated";
import { useUser } from "../../context/user-provider";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const back = require("../../assets/icon/goback.png");
const dropdown = require("../../assets/icon/dropdown.png");
const search = require("../../assets/icon/search.png");
const check = require("../../assets/icon/check.png");
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

interface Category {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
}
interface ProductName {
  createdAt: string;
  id: string;
  productname: string;
  updatedAt: string;
}

const Addproduct = () => {
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [namemodalVisible, setNameModalVisible] = useState(false);
  const [pricemodalVisible, setpriceModalVisible] = useState<number | null>(
    null
  );
  const [iscameraActive, setisCameraActive] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [message, setMessage] = useState("");
  const [iscategories, setCategories] = useState<Category[]>([]);
  const [productname, setProductname] = useState<ProductName[]>([]);
  const [currentQty, setcurrentQty] = useState("");
  const [inputs, setInputs] = useState([{ quantity: "", price: "" }]);
  const [productName, setproductName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isoptions, setisoptions] = useState([
    "1-9pc",
    "10-19pc",
    "20-29pc",
    "30-39pc",
    "40-49pc",
    "50-100pc",
  ]);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isNewpicture, setisNewpicture] = useState(false);
  const [isFirstcapture, setFirstCapture] = useState(false);
  const [isreview, setPreview] = useState(false);
  const cameraRef = useRef<any>(null);
  const [isViewImage, setIsViewImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null | any>(null);

  // get cates
  useEffect(() => {
    const allcategories = async () => {
      try {
        const allcate = await categories();
        const cat = allcate.data?.allcat.rows;
        setCategories(cat);
      } catch (error) {
        console.log(error);
      }
    };
    allcategories();
  }, []);

  // Get names
  useEffect(() => {
    const category_names = async () => {
      try {
        const allname = await product_names(selectedValue);
        const name = allname.data?.cate.rows;
        setProductname(name);
      } catch (error) {
        console.log(error);
      }
    };
    category_names();
  }, [selectedValue]);

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
    if (name === "quantity") {
      setpriceModalVisible(null);
    }
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

  const handleFormsubmit = async () => {
    try {
      const formData = {
        category: selectedValue,
        productName: productName,
        pricing: inputs,
        currentQuantity: currentQty,
        images: capturedImages,
      };
      const res = await new_product(formData);
      if (res) {
        setMessage("Your product has been added to your store");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = () => {
    navigation.navigate("(tabs)", { screen: "Home" });
  };

  const options = iscategories.map((category) => category.name);
  const pname = productname.map((name) => name.productname);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredpname = pname.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setModalVisible(false);
  };

  const handleProductname = (value: string) => {
    setproductName(value);
    setNameModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {isreview ? (
            <View className="w-full h-[90vh] px-3">
              <TouchableOpacity
                onPress={() => setPreview(false)}
                className="bg-themeGreen/10 w-[78px] h-[35px] flex justify-center items-center flex-row rounded-md"
              >
                <Image source={back} />
                <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
                  Go Back
                </Text>
              </TouchableOpacity>
              <View className="h-[32px] w-full my-4">
                <Text className="text-[20px] mb-1 font-bold font-DMSans text-[#25313E]">
                  Review your product detail
                </Text>
              </View>
              <View className="flex flex-row justify-between w-full items-center h-[16px]">
                <Text className="text-[14px] font-DMSans font-bold text-[#25313E]">
                  Product Information
                </Text>
                <TouchableOpacity
                  onPress={() => setPreview(false)}
                  className="flex flex-row justify-center items-center"
                >
                  <AntDesign name="edit" size={20} color="#415BE6" />
                  <Text className="text-[14px] ml-1 font-DMSans font-bold text-[#415BE6]">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="h-auto w-full rounded-[14px] bg-[#F5F6FB] border-[1px] border-[#E6E6E8] my-[14px] p-[14px]">
                <View className="flex flex-row justify-between w-full items-center h-[27px]">
                  <Text className="text-[14px] font-DMSans font-normal text-[#435060]">
                    Product Category
                  </Text>
                  <Text className="text-[14px] font-DMSans font-bold text-[#25313E]">
                    {selectedValue}
                  </Text>
                </View>
                <View className="flex flex-row justify-between w-full items-center h-[27px]">
                  <Text className="text-[14px] font-DMSans font-normal text-[#435060]">
                    Product Name
                  </Text>
                  <Text className="text-[14px] font-DMSans font-bold text-[#25313E]">
                    {productName}
                  </Text>
                </View>
                <View className="flex flex-row justify-between w-full items-center h-[27px]">
                  <Text className="text-[14px] font-DMSans font-normal text-[#435060]">
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
                <View className="flex flex-row justify-between w-full items-center h-[27px]">
                  <Text className="text-[14px] font-DMSans font-normal text-[#435060]">
                    How many tubers do you have in stock?
                  </Text>
                  <Text className="text-[14px] font-DMSans font-bold text-[#25313E]">
                    {currentQty}
                  </Text>
                </View>
              </View>
              {/*  */}
              <View className="flex flex-row justify-between w-full items-center h-[27px]">
                <Text className="text-[14px] font-DMSans font-bold text-[#25313E]">
                  Pricing & Quantity
                </Text>
                <TouchableOpacity
                  onPress={() => setPreview(false)}
                  className="flex flex-row justify-center items-center"
                >
                  <AntDesign name="edit" size={20} color="#415BE6" />
                  <Text className="text-[14px] ml-1 font-DMSans font-bold text-[#415BE6]">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="h-auto w-full rounded-[14px] bg-[#F5F6FB] border-[1px] border-[#E6E6E8] my-[14px] p-[14px]">
                <View className="flex flex-row justify-between w-full items-center h-[27px]">
                  <Text className="text-[14px] font-DMSans font-normal text-[#435060]">
                    Product Price
                  </Text>
                  {inputs.map((input, index) => (
                    <Text
                      key={index}
                      className="text-[14px] font-DMSans font-bold text-[#25313E]"
                    >
                      {input.price}
                    </Text>
                  ))}
                </View>
                <View className="flex flex-row justify-between w-full items-center h-[27px]">
                  <Text className="text-[14px] font-DMSans font-normal text-[#435060]">
                    Product Quantity
                  </Text>
                  {inputs.map((input, index) => (
                    <Text
                      key={index}
                      className="text-[14px] font-DMSans font-bold text-[#25313E]"
                    >
                      {input.quantity}
                    </Text>
                  ))}
                </View>
              </View>
              <View className="absolute bottom-3 left-1 flex flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={() => setPreview(false)}
                  className="h-[50px] w-[49%] border-[1px] bg-transparent border-themeGreen rounded-[4px] flex justify-center items-center"
                >
                  <Text className=" text-left text-[16px] font-bold font-DMSans text-themeGreen">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFormsubmit}
                  className="h-[50px] w-[49%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                >
                  <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="w-full h-[90vh] px-3">
              {iscameraActive ? (
                <View className="w-full relative h-[90vh]">
                  <TouchableOpacity
                    onPress={() => setisCameraActive(false)}
                    className="bg-themeGreen/10 w-[78px] h-[35px] flex justify-center items-center flex-row rounded-md"
                  >
                    <Image source={back} />
                    <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
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
                  <View className="w-full">
                    {isFirstcapture ? (
                      <View className="flex flex-col w-full h-[400px]">
                        <>
                          {isNewpicture && capturedImages.length > 0 ? (
                            <View className="w-full h-full">
                              {isViewImage ? (
                                <View>
                                  <ImageBackground
                                    source={{
                                      uri: selectedImage,
                                    }}
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
                                {capturedImages.map((image, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() => handleImageClick(image)}
                                  >
                                    <ImageBackground
                                      key={index}
                                      source={{ uri: image }}
                                      className="w-[60px] h-[60px] ml-2 rounded-lg overflow-hidden relative z-0"
                                    >
                                      <TouchableOpacity
                                        onPress={() => handleImageRemove(index)}
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
                                ))}
                              </View>
                            </View>
                          ) : (
                            <>
                              {capturedImages.length > 0 ? (
                                <View className="flex flex-col w-full rounded-lg justify-center items-center">
                                  <View className="relative rounded-lg w-full h-full pt-8">
                                    {capturedImages.map((image, index) => (
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
                                    ))}
                                  </View>
                                  <TouchableOpacity
                                    className="w-full h-[44px] border-[1px] border-dashed border-[#6D9EFF] rounded-[4px] flex justify-center items-center flex-row mt-4"
                                    onPress={() => setisNewpicture(true)}
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
                  <View className="w-full absolute bottom-0">
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
              ) : (
                <View className="h-[90vh] min-h-[100%]">
                  <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-themeGreen/10 w-[78px] h-[35px] flex justify-center items-center flex-row rounded-md"
                  >
                    <Image source={back} />
                    <Text className="text-[#435060] ml-1 text-[14px] font-DMSans font-normal">
                      Go Back
                    </Text>
                  </TouchableOpacity>
                  <View className="my-4">
                    <Text className="text-[20px] font-bold font-DMSans text-[#25313E]">
                      Add new item
                    </Text>
                    <Text className="text-[14px] font-normal font-DMSans text-[#8F94A8] mt-1">
                      Add a product you would like to sale in your shop.
                    </Text>
                  </View>
                  <View className="my-2 z-30 w-full">
                    <Text className="text-[14px] font-semibold text-[#343434] font-DMSans">
                      Product Category
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      className={`mt-2 relative h-[50px] flex flex-row rounded-[8px] justify-start items-center rounded-[4px], ${
                        selectedValue
                          ? "border-[1px] border-themeGreen"
                          : "border-[1px] border-[#A9A9A9]"
                      }`}
                    >
                      {selectedValue ? (
                        <Text className="ml-2 pl-4 text-[#181818] text-[14px] font-semibold font-DMSans">
                          {selectedValue}
                        </Text>
                      ) : (
                        <Text className="text-[#A9A9A9] pl-4 ml-2 text-[14px] font-semibold font-DMSans">
                          Select Category
                        </Text>
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
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      )}
                      <Image source={dropdown} className="absolute right-3" />
                    </TouchableOpacity>
                  </View>
                  {selectedValue && (
                    <View className="my-2 z-20">
                      <Text className="text-[14px] font-semibold text-[#343434] font-DMSans">
                        Product Name
                      </Text>
                      <TouchableOpacity
                        onPress={() => setNameModalVisible(!namemodalVisible)}
                        className={`mt-2 relative h-[50px] flex flex-row rounded-[8px] justify-start items-center rounded-[4px], ${
                          productName
                            ? "border-[1px] border-themeGreen"
                            : "border-[1px] border-[#A9A9A9]"
                        }`}
                      >
                        {productName ? (
                          <Text className="ml-2 pl-4 text-[#181818] text-[14px] font-semibold font-DMSans">
                            {productName}
                          </Text>
                        ) : (
                          <Text className="text-[#A9A9A9] pl-4 ml-2 text-[14px] font-semibold font-DMSans">
                            Select your product
                          </Text>
                        )}
                        {namemodalVisible && (
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
                                  <ScrollView className="flex-grow">
                                    {filteredpname.map((option, index) => (
                                      <TouchableOpacity
                                        key={index}
                                        className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                                        onPress={() =>
                                          handleProductname(option)
                                        }
                                      >
                                        <Text>{option}</Text>
                                        {productName === option && (
                                          <Image source={check} />
                                        )}
                                      </TouchableOpacity>
                                    ))}
                                  </ScrollView>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          </View>
                        )}
                        <Image source={dropdown} className="absolute right-3" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {productName && (
                    <View className="my-2 z-0">
                      <Text className="text-[14px] font-semibold text-[#343434] font-DMSans">
                        Pricing (Enter the price of your product)
                      </Text>
                      <View className="w-full z-10 border-[1px] border-[#dddfe6] bg-[#E6E6E8] py-[18px] px-2 rounded-[18px] mt-4">
                        {inputs.map((input, inputIndex) => (
                          <View
                            key={inputIndex}
                            className="flex flex-row mt-2 w-full justify-between items-center "
                          >
                            <View className="w-[50%]">
                              <Text className="text-[14px] font-semibold font-DMSans text-[#25313E] mb-2">
                                Product Quantity
                              </Text>
                              <TouchableOpacity
                                // onPress={() =>
                                //   setpriceModalVisible(!inputIndex)
                                // }
                                onPress={() =>
                                  setpriceModalVisible(
                                    pricemodalVisible === inputIndex
                                      ? null
                                      : inputIndex
                                  )
                                }
                                className={`px-2 h-[50px] relative flex justify-between flex-row items-center rounded-[4px] w-[98%] rounded-[4px], ${
                                  input.quantity
                                    ? "border-[1px] border-themeGreen bg-[#00A45F]/10 "
                                    : "border-[1px] border-[#A9A9A9] bg-white "
                                }`}
                              >
                                {input.quantity ? (
                                  <Text className="text-[#181818] text-[14px] font-semibold font-DMSans">
                                    {input.quantity}
                                  </Text>
                                ) : (
                                  <Text className="text-[#A9A9A9] pl-4 ml-2 text-[14px] font-semibold font-DMSans">
                                    Select quantity
                                  </Text>
                                )}
                                {pricemodalVisible === inputIndex && (
                                  <View className="w-full absolute top-[100%]">
                                    <View
                                      className={`w-[158px] h-[276px] bg-white px-2 py-2 rounded-[4px] shadow-lg`}
                                    >
                                      <ScrollView className="flex-grow">
                                        {isoptions.map(
                                          (option, optionIndex) => (
                                            <TouchableOpacity
                                              key={optionIndex}
                                              className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                                              onPress={() =>
                                                handleInputChange(
                                                  inputIndex, // Use the correct input index here
                                                  "quantity",
                                                  option
                                                )
                                              }
                                            >
                                              <Text>{option}</Text>
                                              {input.quantity === option && (
                                                <Image source={check} />
                                              )}
                                            </TouchableOpacity>
                                          )
                                        )}
                                      </ScrollView>
                                    </View>
                                  </View>
                                )}
                                <Image source={dropdown} />
                              </TouchableOpacity>
                            </View>

                            <View className="w-[50%]">
                              <Text className="text-[14px] font-semibold font-DMSans text-[#25313E] mb-2">
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
                                    handleInputChange(inputIndex, "price", text)
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
                        <Text className="text-[14px] font-normal text-[#343434] font-DMSans">
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
                      <View className="mt-14">
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
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
          <ProductCreated
            userId={message}
            isOpen={isModalOpen}
            handleContinue={handleContinue}
            closeModal={handleModalClose}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 500,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
});
export default Addproduct;
