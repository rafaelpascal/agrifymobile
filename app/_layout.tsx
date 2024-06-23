import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { UserProvider } from "@/context/user-provider";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded, error] = useFonts({
    "DM Sans": require("../assets/fonts/DMSans_18pt-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
