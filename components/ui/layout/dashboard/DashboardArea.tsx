import { TopNav, TopNavProps } from "../top-nav";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

interface DashboardAreaProps extends TopNavProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardArea = (props: DashboardAreaProps) => {
  const { children, title } = props;

  return (
    <View className="fixed flex w-full h-full bg-white flex-col gap-y-4 overflow-y-hidden py-4 sm:relative sm:overflow-y-auto">
      <StatusBar hidden={false} />
      <View className="px-5">
        <TopNav title={title} />
      </View>
      <View className="max-h-[calc(100vh-120px)] h-[75vh] overflow-y-auto overflow-x-hidden px-4 rounded-[8px]">
        <View className="lg:pb-10">{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 15,
    width: "auto",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
