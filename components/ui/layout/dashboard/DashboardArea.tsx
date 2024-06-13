import { TopNav, TopNavProps } from "../top-nav";
import { View, Image, Text, TouchableOpacity } from "react-native";

interface DashboardAreaProps extends TopNavProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardArea = (props: DashboardAreaProps) => {
  const { children, title } = props;

  return (
    <View className="fixed flex w-full h-full  flex-col gap-y-4 overflow-y-hidden py-4 sm:relative sm:overflow-y-auto">
      <View className="px-5">
        <TopNav title={title} />
      </View>
      <View className="max-h-[calc(100vh-120px)] h-[90vh] overflow-y-auto overflow-x-hidden px-4 rounded-[8px]">
        <View className="lg:pb-10">{children}</View>
      </View>
    </View>
  );
};
