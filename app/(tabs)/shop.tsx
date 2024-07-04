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
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { useUser } from "../../context/user-provider";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");
const plus = require("../../assets/images/plus.png");

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

type RootStackParamList = {
  // "(auth)": NavigatorScreenParams<AuthStackParamList>;
  "(actions)": NavigatorScreenParams<TabParamList>;
  "+not-found": undefined;
  Other: undefined;
};

type TabParamList = {
  add_product: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "(actions)">,
  BottomTabNavigationProp<TabParamList>
>;

export default function Shops() {
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [eventory, seteventoryItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemPressed, setItemPressed] = useState<ViewItem>(defaultItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [filteredItems, setFilteredItems] = useState(eventory);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
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

  const handlenewProduct = () => {
    navigation.navigate("(actions)", { screen: "add_product" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        <View className="h-full">
          <View className="w-full h-full">
            <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
              Shop
            </Text>
            <Text className="font-semibold text-[13px] font-DMSans text-[#8F94A8]">
              You can see what you have in your shop and manage them.
            </Text>
            <View className="flex h-full mt-4 items-center justify-start w-full rounded-[8px]">
              <DashboardCardRow dashboardHeroCards={dashboardHeroCards} />
              <View className="w-full my-3">
                <TouchableOpacity
                  onPress={handlenewProduct}
                  className="h-[38px] flex-row bg-themeGreen rounded-[4px] flex justify-center items-center w-full"
                >
                  <Image source={plus} />
                  <Text className="text-themeGrey ml-2 text-[14px] font-semibold font-DMSans">
                    Add Product to shop
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mb-3 flex flex-row justify-between items-center z-10">
                <View className="w-[60%] flex-row px-4 flex justify-start items-center h-[48px] border-[1px] border-[#E6E6E8] bg-[#FFFFFF] rounded-[8px]">
                  <Feather name="search" size={20} color="black" />
                  <TextInput
                    placeholder="Search..."
                    className="w-full h-full rounded-[8px] ml-2"
                    placeholderTextColor="#435060"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                  ></TextInput>
                </View>

                <View className="w-[40%] flex-row px-2 flex justify-between items-center h-[36px] bg-[#FFFFFF] rounded-[8px]">
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
                <View className="flex bg-[#F1F2F2] px-[14px] py-2 rounded-[4px] flex-row justify-between items-start w-full">
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
