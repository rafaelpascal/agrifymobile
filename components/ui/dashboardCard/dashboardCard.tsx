import { View, Image, Text, ImageSourcePropType } from "react-native";

export interface DashboardCardProps {
  icon: ImageSourcePropType;
  title: string;
  value: string | number;
  children?: React.ReactNode;
  childrenClassName?: string;
  className?: string;
}

export const DashboardCard = (props: DashboardCardProps) => {
  const { children, icon, title, value, className } = props;

  return (
    <View className="flex flex-row mx-1 justify-between items-center">
      <View className="w-[114px] h-auto border-[1px] border-[#343434] rounded-[8px] bg-[#FDF9F4]">
        <View className="p-[8px]">
          <Image source={icon} />
          <Text className="mt-2 text-[14px] font-semibold font-DMSans">
            {title}
          </Text>
        </View>
        <View className="p-[8px]">
          <Text className="text-[14px] font-bold font-DMSans">{value}</Text>
        </View>
      </View>
    </View>
  );
};
