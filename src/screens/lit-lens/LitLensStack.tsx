import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { LitLensProvider } from "../../contexts/LitLensContext";
import { useAppTheme } from "../../theme/Theme";
import { CameraScreen } from "./CameraScreen";
import { LitLensScreen } from "./LitLensScreen";

export const LitLensStack = () => {
  const Stack = createNativeStackNavigator();
  const theme = useAppTheme();

  return (
    <LitLensProvider>
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
          options={{
            headerTitle: "LitLens",
            headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ headerTitle: "Câmera" }}
        />
      </Stack.Navigator>
    </LitLensProvider>
  );
};
