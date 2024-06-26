import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
import { PreviousItems } from "../../components/ui/product/PreviousItems";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUser } from "../../context/user-provider";
import { get_previous_sales, get_pending_order } from "../../utils/apiService";
import { ProductDetails } from "../../components/ui/modals/ProductDetails";
import DropDownPicker from "react-native-dropdown-picker";
const order = require("../../assets/images/pendingOrder.png");
const sales = require("../../assets/images/sales.png");

type Item = {
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
};
type ViewItem = {
  category: string;
  id: string;
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
};

const defaultItem: ViewItem = {
  category: "",
  id: "",
  icon: "",
  title: "",
  qty: 0,
  status: false,
  value: 0,
  amount: 0,
};

export default function Sales() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousItem, setpreviousItem] = useState([defaultItem]);
  const [pendings, setpendings] = useState([defaultItem]);
  const [previousTotal, setPreviousTotal] = useState<string>("0");
  const [pendingTotal, setPendingTotal] = useState<string>("0");
  const [orderId, setOrderId] = useState<string>("0");
  const [isprevioussales, setPrevioussales] = useState(true);
  const [ispendingOrder, setPendingOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingsearchQuery, setpendingSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [penfilterCriteria, setpenFilterCriteria] = useState("");
  const [filteredItems, setFilteredItems] = useState(previousItem);
  const [penfilteredItems, setPenFilteredItems] = useState(pendings);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [penvalue, setPenValue] = useState<string>("");
  const [items, setItems] = useState([
    { label: "Filter", value: "" },
    { label: "Tuber Crop", value: "Tuber Crop" },
    { label: "Grain Crop", value: "Grain Crop" },
  ]);

  const nsetFilterCriteria = (newValue: string | null) => {
    if (newValue !== null) {
      setValue(newValue);
    }
  };

  const pendingsetFilterCriteria = (newValue: string | null) => {
    if (newValue !== null) {
      setPenValue(newValue);
    }
  };

  useEffect(() => {
    const filtered = previousItem.filter((item) => {
      const matchesSearchQuery = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilterCriteria = filterCriteria
        ? item.title === filterCriteria
        : true;

      return matchesSearchQuery && matchesFilterCriteria;
    });

    setFilteredItems(filtered);
  }, [searchQuery, filterCriteria, previousItem]);

  useEffect(() => {
    const filtered = previousItem.filter((item) => {
      const matchesSearchQuery = item.category
        .toLowerCase()
        .includes(value.toLowerCase());

      const matchesFilterCriteria = filterCriteria
        ? item.title === filterCriteria
        : true;

      return matchesSearchQuery && matchesFilterCriteria;
    });

    setFilteredItems(filtered);
  }, [value, filterCriteria, previousItem]);

  useEffect(() => {
    const filtered = pendings.filter((item) => {
      const matchesSearchQuery = item.title
        .toLowerCase()
        .includes(pendingsearchQuery.toLowerCase());

      const matchesFilterCriteria = penfilterCriteria
        ? item.title === penfilterCriteria
        : true;

      return matchesSearchQuery && matchesFilterCriteria;
    });

    setPenFilteredItems(filtered);
  }, [pendingsearchQuery, penfilterCriteria, pendings]);

  useEffect(() => {
    const filtered = pendings.filter((item) => {
      const matchesSearchQuery = item.category
        .toLowerCase()
        .includes(penvalue.toLowerCase());

      const matchesFilterCriteria = penfilterCriteria
        ? item.title === penfilterCriteria
        : true;

      return matchesSearchQuery && matchesFilterCriteria;
    });

    setPenFilteredItems(filtered);
  }, [penvalue, penfilterCriteria, pendings]);

  const handlePreviousSales = () => {
    setPendingOrder(false);
    setPrevioussales(true);
  };

  const handlependingOrder = () => {
    setPrevioussales(false);
    setPendingOrder(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleItemPressed = (item: any) => {
    setOrderId(item);
    setIsModalOpen(true);
  };
  //
  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    const getprevioussales = async () => {
      try {
        const all_previous_sales = await get_previous_sales(user);
        const previoussales = all_previous_sales?.completed_sales.rows;

        const transformedData = previoussales.map((sales: any) => {
          const firstImage = sales.product.images[0];
          return {
            id: sales.id,
            icon: firstImage.imageUrl,
            category: sales.product.category,
            title: sales.product.productName,
            qty: `${sales.qty}`,
            status: sales.status || false,
            value: sales.amount,
            amount: parseFloat(sales.amount),
          };
        });

        // Sum up the total sales amount
        const totalSalesAmount = transformedData.reduce(
          (sum: number, sale: ViewItem) => sum + sale.amount,
          0
        );
        const newamout = currencyFormatter.format(totalSalesAmount);
        setPreviousTotal(newamout);
        setpreviousItem(transformedData);
      } catch (error) {
        console.log(error);
      }
    };
    getprevioussales();
  }, [user]);

  useEffect(() => {
    const getpendingorder = async () => {
      try {
        const all_pending_sales = await get_pending_order(user);
        const pendingorder = all_pending_sales?.completed_sales.rows;
        const transformedData = pendingorder.map((sales: any) => {
          const firstImage = sales.product.images[0];
          return {
            id: sales.id,
            icon: firstImage.imageUrl,
            category: sales.product.category,
            title: sales.product.productName,
            qty: `${sales.qty}`,
            status: sales.status || false,
            value: sales.amount,
            amount: parseFloat(sales.amount),
          };
        });

        const totalSalesAmount = transformedData.reduce(
          (sum: number, sale: ViewItem) => sum + sale.amount,
          0
        );
        const newamout = currencyFormatter.format(totalSalesAmount);
        setPendingTotal(newamout);
        setpendings(transformedData);
      } catch (error) {
        console.log(error);
      }
    };
    getpendingorder();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <DashboardArea title={`Welcome Raphael`}>
        <View className="w-full h-full">
          <Text className="font-bold text-[20px] font-DMSans text-[#25313E]">
            Sales
          </Text>
          <Text className="font-semibold text-[13px] font-DMSans text-[#8F94A8]">
            View your sales record from your store
          </Text>
          <View className="w-full my-4 flex justify-between items-center flex-row">
            <View className="h-[103px] flex flex-col justify-between items-start w-[49%] rounded-[8px] border-[1px] border-[#343434] bg-[#FFFBEA] mr-1 p-[10px]">
              <View className="w-[78px] h-[43px]">
                <Image source={sales} className="w-[38px] h-[38px] mb-1" />
                <Text className="text-[12px] font-DMSans text-[#435060] font-semibold">
                  Sales Balance
                </Text>
              </View>
              <Text className="w-full text-[16px] font-bold font-DMSans text-[#435060]">
                {previousTotal}
              </Text>
            </View>
            <View className="h-[103px]  w-[49%] rounded-[8px] border-[1px] border-[#343434] bg-[#F2FCFF] ml-1  flex flex-col justify-between items-start p-[10px]">
              <View className="w-full h-[43px]">
                <Image source={order} className="w-[38px] h-[38px] mb-1" />
                <Text className="text-[12px] w-full font-DMSans text-[#435060] font-semibold">
                  Pending Order
                </Text>
              </View>
              <Text className="w-full text-[16px] font-bold font-DMSans text-[#435060]">
                {pendingTotal}
              </Text>
            </View>
          </View>
          <View className="h-[49px] w-full rounded-[12px] bg-[#F5F6FA] flex flex-row justify-between items-center px-[4px]">
            <TouchableOpacity
              className={`${
                isprevioussales
                  ? "bg-[#fff] h-[40px] w-[48%] rounded-[12px] flex justify-center items-center"
                  : "bg-transparent mr-1 h-[40px] w-[172px] rounded-[12px] flex justify-center items-center"
              }`}
              onPress={handlePreviousSales}
            >
              <Text
                className={`${
                  isprevioussales
                    ? "text-[14px] font-semibold font-DMSans text-[#25313E]"
                    : "text-[14px] font-semibold font-DMSans text-[#AFAEBC]"
                }`}
              >
                Your previous Sales
              </Text>
            </TouchableOpacity>
            {/* Taps */}
            <TouchableOpacity
              className={`${
                ispendingOrder
                  ? "bg-[#fff] h-[40px] w-[48%] rounded-[12px] flex justify-center items-center"
                  : "bg-transparent ml-1 h-[40px] w-[172px] rounded-[12px] flex justify-center items-center"
              }`}
              onPress={handlependingOrder}
            >
              <Text
                className={`${
                  ispendingOrder
                    ? "text-[14px] font-semibold font-DMSans text-[#25313E]"
                    : "text-[14px] font-semibold font-DMSans text-[#AFAEBC]"
                }`}
              >
                Your pending order
              </Text>
            </TouchableOpacity>
          </View>
          {isprevioussales && (
            <View className="my-2 flex flex-row justify-between items-center z-10">
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
          )}
          {ispendingOrder && (
            <View className="my-2 flex flex-row justify-between items-center z-10">
              <View className="w-[60%] flex-row px-4 flex justify-start items-center h-[36px] border-[1px] border-[#E6E6E8] bg-[#FFFFFF] rounded-[8px]">
                <Feather name="search" size={20} color="black" />
                <TextInput
                  placeholder="Search..."
                  className="w-full h-full rounded-[8px] ml-2"
                  placeholderTextColor="#435060"
                  value={pendingsearchQuery}
                  onChangeText={(text) => setpendingSearchQuery(text)}
                ></TextInput>
              </View>

              <View className="w-[40%] mt-3 flex-row px-2 flex justify-between items-center h-[36px] bg-[#FFFFFF] rounded-[8px]">
                <DropDownPicker
                  open={open}
                  value={penvalue}
                  items={items}
                  autoScroll={true}
                  zIndex={1000}
                  setOpen={setOpen}
                  setValue={setPenValue}
                  setItems={setItems}
                  onChangeValue={(newValue) =>
                    pendingsetFilterCriteria(newValue)
                  } // Ensure the correct setFilterCriteria function is used
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
          )}
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View className="w-full z-0">
              {isprevioussales && (
                <View>
                  <View className="flex flex-row justify-between items-center">
                    <Text className="text-[14px] font-semibold font-DMSans text-[#25313E] my-2">
                      Previous Order
                    </Text>
                    <Text
                      className={`text-[14px] font-semibold font-DMSans my-2 ${
                        previousItem.length <= 4
                          ? "text-themeDanger"
                          : "text-[#25313E]"
                      }`}
                    >
                      ({filteredItems.length})
                    </Text>
                  </View>
                  {filteredItems.map((item, index) => (
                    <PreviousItems
                      list=""
                      key={index}
                      icon={item.icon}
                      id={item.id}
                      title={item.title}
                      qty={item.qty}
                      status={item.status}
                      value={item.value}
                      onItemPressed={() => handleItemPressed(item.id)}
                    />
                  ))}
                </View>
              )}
              {ispendingOrder && (
                <View>
                  <View className="flex flex-row justify-between items-center">
                    <Text className="text-[14px] font-semibold font-DMSans text-[#25313E] my-2">
                      Pending Order
                    </Text>
                    <Text
                      className={`text-[14px] font-semibold font-DMSans my-2 ${
                        pendings.length <= 4
                          ? "text-themeDanger"
                          : "text-[#25313E]"
                      }`}
                    >
                      ({penfilteredItems.length})
                    </Text>
                  </View>
                  {penfilteredItems.map((pending, index) => (
                    <PreviousItems
                      list="pending"
                      key={index}
                      id={pending.id}
                      icon={pending.icon}
                      title={pending.title}
                      qty={pending.qty}
                      status={pending.status}
                      value={pending.value}
                      onItemPressed={() => handleItemPressed(pending.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
          <ProductDetails
            userId={orderId}
            status={false}
            isOpen={isModalOpen}
            closeModal={handleModalClose}
          />
        </View>
      </DashboardArea>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 150,
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
