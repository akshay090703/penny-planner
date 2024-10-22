import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function HomeLayout() {
  // Load the fonts
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  // If fonts are not loaded, show a loading indicator
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Render the stack only if fonts are loaded
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-new-category"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Add New Category",
          headerTitleStyle: {
            fontFamily: "outfit-medium",
          },
        }}
      />
      <Stack.Screen
        name="add-new-category-item"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Add New Item",
          headerTitleStyle: {
            fontFamily: "outfit-medium",
          },
        }}
      />
    </Stack>
  );
}
