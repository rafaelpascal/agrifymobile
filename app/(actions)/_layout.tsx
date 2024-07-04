import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded, error] = useFonts({
    DMsans: require("../../assets/fonts/DMSans_18pt-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add_product" options={{ headerShown: false }} />
      <Stack.Screen name="personal_info" options={{ headerShown: false }} />
      <Stack.Screen name="change_password" options={{ headerShown: false }} />
      <Stack.Screen name="payment_page" options={{ headerShown: false }} />
    </Stack>
  );
}
