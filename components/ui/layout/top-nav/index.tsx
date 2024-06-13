import { Avatar } from "../../avatar";
import { View, Image, Text, TouchableOpacity } from "react-native";

export interface TopNavProps {
  title: string;
}

export const TopNav = ({ title }: TopNavProps) => {
  return (
    <View className="flex flex-row w-full justify-between items-center mt-10 max-md:items-center">
      <View>
        <Text className="text-[20px] font-bold md:text-[20px]">{title}</Text>
      </View>
      <Avatar
        img="https://s3-alpha-sig.figma.com/img/3ac5/9d6a/0557cdcb4822c37843d94f72e14da689?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HGbXwbDZNEGNDVwkPZamfHUGLsPbR5JiSrv7bTdD478UUup6YkkJyYqza4S-8MKZINH30yIULXCnrx~FgOX1pkAgQf7t~~HRYV3ELOh-Pj6cQMSZZt1fROzFih72NsQAb4UZIMULKZ6vIO06w8zOXAviRkGWs8Om8tE856X4A4vOubKdLaQsfCCoO09jEvkmd7bHxbQg42zlBK6eRdGYzsnHLA8jyN2mp6LEK6VLfuC0tsFnIVyi2A6wj4eGf6fdGPBuyudAcTon5XwfIUgu3zM4qNm3vo7ukC64r-zQ-cNPnIC7ps3IQKav6aDiz9YfqptBftCIhOR9-ujgx6kb8A__"
        name=""
        avatarClassName="md:h-11 h-36px w-36px rounded-full md:w-11"
        textClassName="font-medium text-sm max-md:hidden"
        wrapperClassName="max-md:gap-0"
      ></Avatar>
    </View>
  );
};
