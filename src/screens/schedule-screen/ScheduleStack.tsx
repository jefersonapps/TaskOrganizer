import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ActivityType, ScheduleActivityType } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { AddScheduleActivitieScreen } from "./AddScheduleActitivityScreen";
import { EditScheduleActivityScreen } from "./EditScheduleActivityScreen";
import { ScheduleScreen } from "./ScheduleScreen";

export type RootStackScheduleParamList = {
  ScheduleScreen: { activity: ActivityType };
  EditScheduleActivityScreen: { activity: ScheduleActivityType; day: string };
  AddScheduleActivityScreen: { day: string };
};

const Stack = createNativeStackNavigator();
export function ScheduleStack() {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.customBackground },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{ headerShown: false, title: "Agenda" }}
      />
      <Stack.Screen
        name="EditScheduleActivityScreen"
        component={EditScheduleActivityScreen}
        options={{
          title: "Editar atividade",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
      <Stack.Screen
        name="AddScheduleActivityScreen"
        component={AddScheduleActivitieScreen}
        options={{
          title: "Adicionar atividade",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
    </Stack.Navigator>
  );
}
