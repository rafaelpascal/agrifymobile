import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
// import { useUserInactivity } from "./useUserInactivity";

// Save data
const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem("@storage_Key", value);
  } catch (e) {
    // saving error
    console.error(e);
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("@storage_Key");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.error(e);
  }
};

const LOCK_TIME = 30000;

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: any) => {
    if (nextAppState === "inactive") {
      router.push("/(modals)/inactive");
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }

    const recordStartTime = async () => {
      const startTime = Date.now().toString();
      await storeData(startTime);
    };

    if (nextAppState === "background") {
      recordStartTime();
    } else if (
      nextAppState === "active" &&
      appState.current.match(/background/)
    ) {
      const storedTime = await getData();
      if (storedTime) {
        const elapsed = Date.now() - parseInt(storedTime, 10);
        if (elapsed > LOCK_TIME) {
          router.push("/(auth)/sign_in");
        }
      }
    }

    appState.current = nextAppState;
  };

  return children;
};
