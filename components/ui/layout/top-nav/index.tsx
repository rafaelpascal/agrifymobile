import { Avatar } from "../../avatar";
import { View, Image, Text, TouchableOpacity } from "react-native";
const avatar = require("../../../../assets/images/avatar.png");

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
        img="https://s3-alpha-sig.figma.com/img/3ac5/9d6a/0557cdcb4822c37843d94f72e14da689?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BKrWx58NaH7rAGNnzwGGvYvBI2w9AJZ-7yd6mL0bVDCiJImhL4KkNOoEq15PdW4mJgPVrymfviMrPu15e9ZpwI-FL38C4HnULiwoqQBbWUpDYwHMZwBXGEOJ85ZqHgSARYVkQNtJn07W1oBV1-FxZD750xUaqYGq94C5h-8P5RvkwSkfAk9uuAWwNOEz8FpQyqQsonM4f0OZpyAHrRclA6Ks--Huzi690oxc63UaCn8UdJaTmEFUPjbHWxgQrWQzaw-CcItzXN3n06Mz74aUDL2h1Hdc5CsRKW0NfnB6TEF7JUY6P9XVsjkTfkB-U7XDoHb20Nll9W1tmZL1R5Mocg__"
        name="Raphael"
        avatarClassName="md:h-11 h-36px w-36px rounded-full md:w-11"
        textClassName="font-medium text-sm max-md:hidden"
        wrapperClassName="max-md:gap-0"
      ></Avatar>
    </View>
  );
};
