import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
  clear: boolean; // Added to trigger clearing inputs
}

export const PINinput: React.FC<OTPInputProps> = ({
  length,
  onChange,
  clear,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      onChange(newOtp.join(""));

      if (text && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  React.useEffect(() => {
    if (clear) {
      setOtp(Array(length).fill(""));
      inputsRef.current[0]?.focus();
    }
  }, [clear, length]);

  return (
    <View className="w-full flex flex-row justify-between items-center">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          keyboardType="numeric"
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
          className="w-[63px] h-[64px] text-center text-[24px] font-normal border-[1px] border-[#A9A9A9] rounded-full"
        />
      ))}
    </View>
  );
};
