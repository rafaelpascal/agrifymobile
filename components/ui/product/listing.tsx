import { View, Image, ImageSourcePropType, Text } from "react-native";

export interface DashboardCardProps {
  icon: string;
  title: string;
  qty: string;
  status: boolean;
  value: number;
}

export const BaseItem = (props: DashboardCardProps) => {
  const { icon, qty, status, title, value } = props;

  return (
    <View className="w-full border-[2px] flex flex-row justify-between items-center border-[#E6E6E8] h-[64px] my-[4px] rounded-[8px] p-[10px]">
      <View className="flex flex-row justify-start items-end">
        {icon ? (
          <Image
            source={{ uri: icon }}
            className="w-[40px] h-[40px] rounded-md"
          />
        ) : (
          <Text>No Image</Text>
        )}
        <View className="flex ml-2 flex-col justify-between h-full items-start">
          <Text className="text-[14px] font-bold font-DMSans ">{title}</Text>
          <View className="flex flex-row justify-start items-center">
            <Text className="mr-2 font-DMSans font-normal text-[#8F94A8] text-[13px]">
              {qty} Baskets
            </Text>
            {status === true ? (
              <View className="flex justify-center items-start rounded-[4px] bg-themeGreen/10">
                <Text className="w-auto px-3 font-normal h-auto text-[12px] text-themeGreen py-[3px]">
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
      {status === true ? (
        <Text className="text-[16px] text-[#25313E] font-DMSans font-bold">
          ₦{value}
        </Text>
      ) : (
        <Text className="text-[16px] text-[#D48B1F] font-DMSans font-bold">
          ₦{value}
        </Text>
      )}
    </View>
  );
};
