import { View, Image, Text, TouchableOpacity } from "react-native";

export interface DashboardCardProps {
  id: string;
  icon: string;
  title: string;
  qty: number;
  status: boolean;
  value: number;
  list: string;
  onItemPressed?: () => void;
}

export const PreviousItems = (props: DashboardCardProps) => {
  const { icon, qty, status, title, value, list, onItemPressed } = props;

  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const newVal = currencyFormatter.format(value);
  return (
    <TouchableOpacity
      onPress={onItemPressed}
      className="w-full border-[2px] flex flex-row justify-between items-center border-[#E6E6E8] h-[74px] my-[4px] rounded-[8px] px-[10px] py-3"
    >
      <View className="flex flex-row justify-start items-center">
        {icon ? (
          <Image
            source={{ uri: icon }}
            className="w-[40px] h-[40px] rounded-md"
          />
        ) : (
          <Text>No Image</Text>
        )}
        <View className="flex ml-2 flex-col justify-center items-start">
          <Text className="text-[14px] font-bold font-DMSans ">{title}</Text>
          <View className="flex flex-row justify-center items-center">
            {list === "pending" && (
              <Text className="font-DMSans font-normal text-[#CE4500] text-[13px]">
                Request:
              </Text>
            )}
            <Text className="font-DMSans font-normal text-[#8F94A8] text-[13px]">
              {qty} baskets
            </Text>
          </View>
          <View className="flex flex-row justify-start items-center">
            <Text className="mr-2 font-DMSans font-normal text-[#8F94A8] text-[13px]">
              {newVal}
            </Text>
            {status === true ? (
              <View className="flex justify-center items-start rounded-[4px] bg-themeGreen/10">
                <Text className="w-auto px-3 font-normal h-auto text-[14px] text-themeGreen py-[3px]">
                  Sold
                </Text>
              </View>
            ) : (
              <View className="flex justify-center items-start rounded-[4px] bg-[#D48B1F]/10">
                <Text className="w-auto px-3 font-normal h-auto py-[3px] text-[#D48B1F]">
                  Pending
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onItemPressed}>
        <Text className="text-[#415BE6] text-[14px] font-semibold font-DMSans">
          View details
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
