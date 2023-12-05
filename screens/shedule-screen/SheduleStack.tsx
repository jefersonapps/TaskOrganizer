import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { AddActivitieScreen } from "./AddActivitieScreen";
import { useAppTheme } from "../../theme/Theme";
import { ActivityType, SheduleActivityType } from "../../contexts/AppContext";
import { ScheduleScreen } from "./SheduleScreen";
import { EditSheduleActivityScreen } from "./EditSheduleActivityScreen";
import { AddSheduleActivitieScreen } from "./AddSheduleActitivityScreen";

export type RootStackSheduleParamList = {
  SheduleScreen: { activity: ActivityType };
  EditSheduleActivityScreen: { activity: SheduleActivityType; day: string };
  AddSheduleActivityScreen: { day: string };
};

const Stack = createNativeStackNavigator();
export function SheduleStack() {
  const theme = useAppTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SheduleScreen"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditSheduleActivityScreen"
        component={EditSheduleActivityScreen}
        options={{
          title: "Editar atividade",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
      <Stack.Screen
        name="AddSheduleActivityScreen"
        component={AddSheduleActivitieScreen}
        options={{
          title: "Adicionar atividade",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
    </Stack.Navigator>
  );
}
