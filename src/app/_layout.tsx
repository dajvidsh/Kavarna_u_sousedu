import { Colors } from "@/constants/colors";
import { AuthProvider } from "@/context/AuthContext";
import "@/global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ presentation: "modal" }} />
        <Stack.Screen name="login" options={{ presentation: "modal" }} />
        <Stack.Screen name="scanner" options={{ presentation: "modal" }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
