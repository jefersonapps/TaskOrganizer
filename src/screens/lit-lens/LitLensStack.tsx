import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LitLensScreen } from "./LitLensScreen";
import { useAppTheme } from "../../theme/Theme";
import { CameraScreen } from "./CameraScreen";

export const LitLensStack = () => {
  const Stack = createNativeStackNavigator();
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: { backgroundColor: theme.colors.customBackground },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen
        name="LitLensScreen"
        component={LitLensScreen}
        options={{ headerTitle: "LitLens" }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerTitle: "Câmera" }}
      />
    </Stack.Navigator>
  );
};
