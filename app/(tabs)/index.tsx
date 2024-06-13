import { StyleSheet, View, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DashboardArea } from "../../components/ui/layout/dashboard/DashboardArea";
const product = require("../../assets/images/product.png");
const sales = require("../../assets/images/sales.png");
const stock = require("../../assets/images/stock.png");

export default function HomeScreen() {
  return (
    <DashboardArea title={`Welcome Raphael`}>
      <View className="flex h-full items-center justify-start w-full rounded-[8px]">
        <StatusBar style="auto" hidden={false} />
        <View className="flex flex-row justify-between items-center gap-1">
          <View className="w-[114px] h-auto border-[1px] border-[#343434] rounded-[8px] bg-[#FDF9F4]">
            <View className="p-[8px]">
              <Image source={product} />
              <Text className="mt-2 text-[12px] font-semibold font-DMSans">
                Total Product
              </Text>
            </View>
            <View className="p-[8px]">
              <Text className="text-[14px] font-bold font-DMSans">3,234</Text>
            </View>
          </View>
          <View className="w-[114px] h-auto border-[1px] border-[#343434] rounded-[8px] bg-[#FDF9F4]">
            <View className="p-[8px]">
              <Image source={sales} />
              <Text className="mt-2 text-[12px] font-semibold font-DMSans">
                Total Sales
              </Text>
            </View>
            <View className="p-[8px]">
              <Text className="text-[14px] font-bold font-DMSans">
                ₦300,230
              </Text>
            </View>
          </View>
          <View className="w-[114px] h-auto border-[1px] border-[#343434] rounded-[8px] bg-[#FDF9F4]">
            <View className="p-[8px]">
              <Image source={stock} />
              <Text className="mt-2 text-[12px] font-semibold font-DMSans">
                Stock Left
              </Text>
            </View>
            <View className="p-[8px]">
              <Text className="text-[14px] font-bold font-DMSans">2,501</Text>
            </View>
          </View>
        </View>
      </View>
    </DashboardArea>
  );
}
