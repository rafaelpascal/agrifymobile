import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface CountdownTimerProps {
  duration: number; // Duration in seconds
  onTimeout: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  onTimeout,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  return (
    <View>
      {timeLeft > 0 ? (
        <Text className="font-semibold font-DMSans text-[14px] ">
          {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
        </Text>
      ) : (
        <TouchableOpacity className="shadow-lg">
          <Text className=" text-left text-[16px] font-bold font-DMSans text-themeGreen">
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CountdownTimer;
