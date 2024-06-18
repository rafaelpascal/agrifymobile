import { StyleSheet, View, Image, Text } from "react-native";
import {
  DashboardCard,
  DashboardCardProps,
} from "../../ui/dashboardCard/dashboardCard";

interface DashboardCardRowProps {
  dashboardHeroCards: DashboardCardProps[];
}

export const DashboardCardRow: React.FC<DashboardCardRowProps> = ({
  dashboardHeroCards,
}) => {
  return (
    <View className="relative w-full">
      <View className="hide-scrollbar flex flex-row justify-center items-center overflow-auto sm:grid w-full">
        {dashboardHeroCards.map((n) => (
          <DashboardCard
            key={n.title}
            {...n}
            childrenClassName="text-themeGrey px-4 text-sm"
            className="flex-1 max-sm:min-w-[110px] h-auto w-full"
          />
        ))}
      </View>
    </View>
  );
};
