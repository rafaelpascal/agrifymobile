import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  StatusBar,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
import { DashboardCardRow } from "../../components/grouped-components/dashboard-card-row";
import { PreviousItems } from "../../components/ui/product/PreviousItems";
import { DashboardCardProps } from "../../components/ui/dashboardCard/dashboardCard";
import { ShopProductDetails } from "../../components/ui/modals/ShopProductDetails";
import {
  all_product,
  get_previous_sales,
  new_product,
  product_names,
  categories,
  marchant_acc,
} from "../../utils/apiService";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "../../context/user-provider";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProductCreated } from "../../components/ui/modals/ProductCreated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CustomDropdown } from "../../components/ui/text-input/select-input";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const dropdown = require("../../assets/icon/dropdown.png");
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const plus = require("../../assets/images/plus.png");
const back = require("../../assets/icon/goback.png");
const search = require("../../assets/icon/search.png");
const check = require("../../assets/icon/check.png");

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

type Item = {
  id: string;
  category: string;
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
  dateAdded: string;
};
type ViewItem = {
  id: string;
  category: string;
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
  dateAdded: string;
};

const defaultItem: ViewItem = {
  id: "",
  category: "",
  icon: "",
  title: "",
  qty: 0,
  status: false,
  value: 0,
  amount: 0,
  dateAdded: "",
};

export default function Shops() {
  const { user } = useUser();
  const [iscameraActive, setisCameraActive] = useState(false);
  const [namemodalVisible, setNameModalVisible] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [iscategories, setCategories] = useState<Category[]>([]);
  const [productname, setProductname] = useState<ProductName[]>([]);
  const [currentQty, setcurrentQty] = useState("");
  const [inputs, setInputs] = useState([{ quantity: "", price: "" }]);
  const [productName, setproductName] = useState("");
  const [catId, setcatId] = useState("");
  const [marchantName, setisMarchantName] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isNewpicture, setisNewpicture] = useState(false);
  const [isFirstcapture, setFirstCapture] = useState(false);
  const cameraRef = useRef<any>(null);
  const [isViewImage, setIsViewImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null | any>(null);
  const [pricemodalVisible, setpriceModalVisible] = useState<number | null>(
    null
  );
  const [eventory, seteventoryItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemPressed, setItemPressed] = useState<ViewItem>(defaultItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [isreview, setPreview] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState("");
  const [filteredItems, setFilteredItems] = useState(eventory);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [isoptions, setisoptions] = useState([
    "1-9pc",
    "10-19pc",
    "20-29pc",
    "30-39pc",
    "40-49pc",
    "50-100pc",
  ]);
  const [items, setItems] = useState([
    { label: "Filter", value: "" },
    { label: "Tuber Crop", value: "Tuber Crop" },
    { label: "Grain Crop", value: "Grain Crop" },
  ]);
  const [dashboardHeroCards, setDashboardHeroCards] = useState<
    DashboardCardProps[]
  >([
    {
      icon: product,
      title: "Total Product",
      value: 0,
    },
    {
      icon: sales,
      title: "Total Sales",
      value: 0,
    },
    {
      icon: stock,
      title: "Stock Left",
      value: 0,
    },
  ]);
  //
  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  //

  const nsetFilterCriteria = (newValue: string | null) => {
    if (newValue !== null) {
      setValue(newValue);
    }
  };

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

  // Get marchant account
  const marchant = async () => {
    try {
      const acc = await marchant_acc(user);
      setisMarchantName(acc.data.user.lastName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    marchant();
  }, [user]);

  useEffect(() => {
    const filtered = eventory.filter((item) => {
      const matchesSearchQuery = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilterCriteria = filterCriteria
        ? item.title === filterCriteria
        : true;

      return matchesSearchQuery && matchesFilterCriteria;
    });

    setFilteredItems(filtered);
  }, [searchQuery, filterCriteria, eventory]);

  useEffect(() => {
    const filtered = eventory.filter((item) => {
      const matchesSearchQuery = item.category
        .toLowerCase()
        .includes(value.toLowerCase());

      const matchesFilterCriteria = filterCriteria
        ? item.title === filterCriteria
        : true;

      return matchesSearchQuery && matchesFilterCriteria;
    });

    setFilteredItems(filtered);
  }, [value, filterCriteria, eventory]);

  useEffect(() => {
    const getAllProduct = async () => {
      try {
        const allproduct = await all_product();
        const all_previous_sales = await get_previous_sales(user);
        const previoussales = all_previous_sales?.completed_sales.rows;
        const productCount = allproduct.data?.allproduct.count;
        const products = allproduct.data?.allproduct.rows;
        const transformedData = products.map((product: any) => {
          const firstImage = product.images[0];
          const firstPricing = product.pricings[0];

          return {
            icon: firstImage.imageUrl,
            title: product.productName,
            category: product.category,
            dateAdded: product.updatedAt.split("T")[0],
            qty: `${product.currentQuantity}`,
            status: product.status || false,
            value: firstPricing.price,
          };
        });

        const totalCurrentQuantity = products.reduce(
          (sum: number, product: any) =>
            sum + (parseInt(product.currentQuantity) || 0),
          0
        );

        const pptransformedData = previoussales.map((sales: any) => {
          return {
            amount: parseFloat(sales.amount),
          };
        });

        const totalSalesAmount = pptransformedData.reduce(
          (sum: number, sale: ViewItem) => sum + sale.amount,
          0
        );
        const newamout = currencyFormatter.format(totalSalesAmount);

        const updatedDashboardHeroCards = dashboardHeroCards.map((card) => {
          if (card.title === "Total Product") {
            return { ...card, value: productCount || 0 };
          } else if (card.title === "Stock Left") {
            return { ...card, value: totalCurrentQuantity || 0 };
          } else if (card.title === "Total Sales") {
            return { ...card, value: newamout || 0 };
          }
          return card;
        });

        seteventoryItems(transformedData);
        setDashboardHeroCards(updatedDashboardHeroCards);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProduct();
  }, []);

  const handleItemPressed = (item: ViewItem) => {
    setItemPressed(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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

  const handleFormsubmit = async () => {
    try {
      // Constructing the object with form inputs
      const formData = {
        category: selectedValue,
        productName: productName,
        pricing: inputs,
        currentQuantity: currentQty,
        images: capturedImages,
      };
      const res = await new_product(formData);
      console.log(res);
      if (res) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = () => {
    setIsNewProduct(false);
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
      <DashboardArea title={`Welcome Raphael`}>
        <View className="h-full">
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
                      <TouchableOpacity
                        onPress={handleFormsubmit}
                        className="h-[50px] w-[49%] bg-themeGreen rounded-[4px] flex justify-center items-center"
                      >
                        <Text className=" text-left text-[16px] font-bold font-DMSans text-[#fff]">
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ProductCreated
                      userId=""
                      isOpen={isModalOpen}
                      handleContinue={handleContinue}
                      closeModal={handleModalClose}
                    />
                  </View>
                ) : (
                  <View className="w-full h-full">
                    {iscameraActive ? (
                      <View className="w-full relative h-[90vh]">
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
                                      ))}
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
                      <View className="h-[70vh]">
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
                        <View className="my-2 z-30 w-full">
                          <Text className="text-[12px] font-semibold text-[#343434] font-DMSans">
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
                            {/* <CustomDropdown
                              options={options}
                              placeholder="Select a Category"
                              InputClass="top-[36%]"
                              selectedValue={selectedValue}
                              isLoading={loading}
                              onSelect={(value) => setSelectedValue(value)}
                            /> */}
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
                                        {filteredOptions.map(
                                          (option, index) => (
                                            <TouchableOpacity
                                              key={index}
                                              className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                                              onPress={() =>
                                                handleSelect(option)
                                              }
                                            >
                                              <Text>{option}</Text>
                                              {selectedValue === option && (
                                                <Image source={check} />
                                              )}
                                            </TouchableOpacity>
                                          )
                                        )}
                                      </ScrollView>
                                    </View>
                                  </TouchableWithoutFeedback>
                                </View>
                              </View>
                            )}
                            <Image
                              source={dropdown}
                              className="absolute right-3"
                            />
                          </TouchableOpacity>
                        </View>
                        {selectedValue && (
                          <View className="my-2 z-20">
                            <Text className="text-[12px] font-semibold text-[#343434] font-DMSans">
                              Product Name
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                setNameModalVisible(!namemodalVisible)
                              }
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
                              {/* <CustomDropdown
                                  options={pname}
                                  placeholder="Select your product"
                                  InputClass="top-[47%]"
                                  selectedValue={productName}
                                  isLoading={loading}
                                  onSelect={(value) => setproductName(value)}
                                /> */}
                              {namemodalVisible && (
                                <View className="w-full absolute top-[100%] rounded-[4px]">
                                  <View className="w-full h-full flex transition-[.5s] flex-1 justify-center items-center">
                                    <TouchableWithoutFeedback
                                      onPress={() => {}}
                                    >
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
                                          {filteredpname.map(
                                            (option, index) => (
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
                                            )
                                          )}
                                        </ScrollView>
                                      </View>
                                    </TouchableWithoutFeedback>
                                  </View>
                                </View>
                              )}
                              <Image
                                source={dropdown}
                                className="absolute right-3"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                        {productName && (
                          <View className="my-2 z-0">
                            <Text className="text-[12px] font-semibold text-[#343434] font-DMSans">
                              Pricing (Enter the price of your product)
                            </Text>
                            <View className="w-full z-10 border-[1px] border-[#dddfe6] bg-[#E6E6E8] py-[18px] px-2 rounded-[18px] mt-4">
                              {inputs.map((input, inputIndex) => (
                                <View
                                  key={inputIndex}
                                  className="flex flex-row mt-2 w-full justify-between items-center "
                                >
                                  <View className="w-[50%]">
                                    <Text className="text-[12px] font-semibold font-DMSans text-[#25313E] mb-2">
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
                                                    {input.quantity ===
                                                      option && (
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
                                            inputIndex,
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
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <View className="w-full h-full">
              <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
                Shop
              </Text>
              <Text className="font-semibold text-[13px] font-DMSans text-[#8F94A8]">
                You can see what you have in your shop and manage them.
              </Text>
              <View className="flex h-full mt-4 items-center justify-start w-full rounded-[8px]">
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
                <View className="mb-6 mt-2 flex flex-row justify-between items-center z-10">
                  <View className="w-[60%] flex-row px-4 flex justify-start items-center h-[36px] border-[1px] border-[#E6E6E8] bg-[#FFFFFF] rounded-[8px]">
                    <Feather name="search" size={20} color="black" />
                    <TextInput
                      placeholder="Search..."
                      className="w-full h-full rounded-[8px] ml-2"
                      placeholderTextColor="#435060"
                      value={searchQuery}
                      onChangeText={(text) => setSearchQuery(text)}
                    ></TextInput>
                  </View>

                  <View className="w-[40%] mt-3 flex-row px-2 flex justify-between items-center h-[36px] bg-[#FFFFFF] rounded-[8px]">
                    <DropDownPicker
                      open={open}
                      value={value}
                      items={items}
                      autoScroll={true}
                      zIndex={1000}
                      setOpen={setOpen}
                      setValue={setValue}
                      setItems={setItems}
                      onChangeValue={(newValue) => nsetFilterCriteria(newValue)} // Ensure the correct setFilterCriteria function is used
                      placeholder="Filter"
                      style={{
                        width: "100%", // Set width to 100% to fill the parent container
                        borderColor: "#E6E6E8",
                        backgroundColor: "#FFFFFF",
                        borderRadius: 8,
                        zIndex: 1,
                      }}
                      dropDownContainerStyle={{
                        borderColor: "#E6E6E8",
                        borderRadius: 8,
                        width: "100%",
                        backgroundColor: "#FFFFFF",
                      }}
                      placeholderStyle={{
                        color: "#435060",
                      }}
                      ArrowDownIconComponent={({ style }) => (
                        <AntDesign name="caretdown" size={14} color="black" />
                      )}
                    />
                  </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                  <View className="flex bg-[#F1F2F2] px-[12px] py-2 rounded-[4px] flex-row justify-between items-start w-full">
                    <Text className="text-[14px] font-semibold font-DMSans ">
                      Item List
                    </Text>
                    <Text className="text-themeGreen text-[14px] font-semibold font-DMSans ">
                      ({filteredItems.length})
                    </Text>
                  </View>
                  <View className="flex h-auto flex-col w-full justify-center items-start">
                    {filteredItems.map((item, index) => (
                      <PreviousItems
                        list=""
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        id={item.id}
                        qty={item.qty}
                        status={item.status}
                        value={item.value}
                        onItemPressed={() => handleItemPressed(item)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
              <ShopProductDetails
                userId=""
                itemp={itemPressed}
                status={itemPressed.status}
                isOpen={isModalOpen}
                closeModal={handleModalClose}
              />
            </View>
          )}
        </View>
      </DashboardArea>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 150,
    width: "auto",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
