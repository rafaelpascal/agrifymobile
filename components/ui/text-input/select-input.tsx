import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
const check = require("../../../assets/icon/check.png");
const search = require("../../../assets/icon/search.png");

interface CustomDropdownProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onSelect(value);
  };

  return (
    <View className="w-full flex justify-start items-center h-[50px] rounded-[4px] px-3">
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-full h-full flex justify-center"
      >
        {selectedValue ? (
          <Text>{selectedValue}</Text>
        ) : (
          <Text className="text-[#A9A9A9] text-[14px] font-semibold font-DMSans">
            Select Location
          </Text>
        )}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="w-full h-full flex relative bg-[#435060]/50 backdrop-blur-[10px] transition-[.5s] flex-1 justify-center items-center">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="w-[315px] h-[276px] bg-white px-4 py-2 overflow-y-scroll absolute top-[49%] rounded-lg shadow-lg">
                <View className="h-[32px] relative px-2 flex flex-row justify-between items-center w-full rounded-[4px] border-[1px] border-[#CCD0DC]">
                  <TextInput
                    className="h-full w-full"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                  />
                  <View className="absolute right-2 flex flex-row justify-center items-center w-auto ">
                    <Text className="text-[10px] mr-2 font-DMSans font-normal text-[#999999]">
                      Search
                    </Text>
                    <Image source={search} />
                  </View>
                </View>
                <ScrollView className="flex-grow">
                  {filteredOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      className="h-auto flex py-4 flex-row justify-between items-start active:bg-black px-2 rounded-md"
                      onPress={() => handleSelect(option)}
                    >
                      <Text>{option}</Text>
                      {selectedValue === option && <Image source={check} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
