import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConfigScreen } from "./ConfigScreen";
import { FunctionalitiesScreen } from "./FunctionalitiesScreen";
import { useAppTheme } from "../../theme/Theme";

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
      <Stack.Screen name="Config" component={ConfigScreen} />
      <Stack.Screen name="Functionalities" component={FunctionalitiesScreen} />
    </Stack.Navigator>
  );
}
