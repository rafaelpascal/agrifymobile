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
import { get_previous_sales } from "../../utils/apiService";
import { ProductDetails } from "../../components/ui/modals/ProductDetails";
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
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  amount: number;
};

const defaultItem: ViewItem = {
  icon: "",
  title: "",
  qty: 0,
  status: false,
  value: 0,
  amount: 0,
};

const pendings = [
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Irish Potatoes",
    qty: 5,
    status: false,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Sweet Potatoes",
    qty: 22,
    status: true,
    value: 200,
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/ee10/564d/aad91c59eeb694d3acc38b2e444d7534?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YvyE1E1zbhxrJcOlMGTHITRdV1hlG8miWl8MadYNVdKzia6PgsTLdu9E20ygyIoFL6SZqFKge1YghU4RCwEII7UavnnaldJ5ozG0cl2NfL6ba5sczziGhnsPcMOOe4KgBhlQalFDnlh36XsxG9e8bSiMEq8EfwDQd56KTkoQjr5QSxm0SsWR-PNesNg~XboyEw30tvIZ4Bc1SwN~kg1Ih969bEMR-CEnfCS5IjF3rkPeJq0HefYyIVGR3Oc8kcFVG6GGa5VXRN2wcSozqFt6AWQnTEYyzy-~HA3vTMOiDGDmka08nTCAHO0h5KbYK1WkRJdwCf~~h3FkqSjxHCwl-Q__",
    title: "Yam",
    qty: 45,
    status: true,
    value: 200,
  },
];

export default function Sales() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousItem, setpreviousItem] = useState([defaultItem]);
  const [previousTotal, setPreviousTotal] = useState<string>("0");
  const [isprevioussales, setPrevioussales] = useState(true);
  const [ispendingOrder, setPendingOrder] = useState(false);

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
    setIsModalOpen(true);
  };
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
            icon: firstImage.imageUrl,
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
                ₦25,000
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
                Your Previous Sales
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
                Your Previous Sales
              </Text>
            </TouchableOpacity>
          </View>
          <View className="my-2 flex flex-row justify-between items-center">
            <View className="w-[228px] flex-row px-4 flex justify-start items-center h-[36px] border-[1px] border-[#E6E6E8] bg-[#FFFFFF] rounded-[8px]">
              <Feather name="search" size={20} color="black" />
              <TextInput
                placeholder="Search"
                className="w-full h-full rounded-[8px] ml-2"
                placeholderTextColor="#435060"
              ></TextInput>
            </View>
            <View className="w-[112px] flex-row px-4 flex justify-between items-center h-[36px] border-[1px] border-[#E6E6E8] bg-[#FFFFFF] rounded-[8px]">
              <TextInput
                placeholder="Filter"
                className="w-auto h-full rounded-[8px]"
                placeholderTextColor="#435060"
              ></TextInput>
              <AntDesign name="caretdown" size={14} color="black" />
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View className="w-full">
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
                      ({previousItem.length})
                    </Text>
                  </View>
                  {previousItem.map((item, index) => (
                    <PreviousItems
                      list=""
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      qty={item.qty}
                      status={item.status}
                      value={item.value}
                      onItemPressed={() => handleItemPressed(item)}
                    />
                  ))}
                </View>
              )}
              {/*  */}
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
                      ({pendings.length})
                    </Text>
                  </View>
                  {pendings.map((pending, index) => (
                    <PreviousItems
                      list="previous"
                      key={index}
                      icon={pending.icon}
                      title={pending.title}
                      qty={pending.qty}
                      status={pending.status}
                      value={pending.value}
                      onItemPressed={() => handleItemPressed(pending)}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
          <ProductDetails
            userId=""
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
