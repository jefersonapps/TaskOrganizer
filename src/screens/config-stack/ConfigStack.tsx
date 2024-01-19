import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../../theme/Theme";
import { ConfigScreen } from "./ConfigScreen";

export function ConfigStack() {
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
        name="Config"
        component={ConfigScreen}
        options={{
          title: "Ajustes e Relatórios",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        }}
      />
    </Stack.Navigator>
  );
}
