// import { useState } from "react";
import { BaseModal } from "./BaseModal";
const agrifymodal = require("../../../assets/icon/agrifymodal.png");
import { View, Image, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const Accountexist = ({
  userId,
  isOpen,
  closeModal,
}: IModalPropsType) => {
  console.log(userId);

  return (
    <BaseModal userId={userId} isOpen={isOpen} closeModal={closeModal}>
      <>
        <View className="flex bg-themeWhite w-full  items-center justify-center">
          <View className="flex flex-col items-center justify-center lg:w-[336px]">
            <MaterialIcons name="error-outline" size={124} color="#EBA91F" />
            <Text className="text-center text-[16px] mt-2 font-DMSans font-semibold">
              Account not created
            </Text>
            <Text className="text-center mt-2 text-[14px] text-[#f84747] font-semibold font-DMSans">
              {userId}
            </Text>
          </View>
        </View>
        <View className="sticky bg-themeWhite bottom-0 p-[28px] z-10 mt-4 flex h-auto items-center justify-center gap-3">
          <TouchableOpacity
            className="w-full h-auto flex justify-center items-center rounded-[10px] bg-themeGreen sm:h-[46px] text-[#fff] [@media(max-width:800px)]:p-3 p-4"
            onPress={closeModal}
          >
            <Text className="text-[16px] text-[#fff]">Close</Text>
          </TouchableOpacity>
        </View>
      </>
    </BaseModal>
  );
};
