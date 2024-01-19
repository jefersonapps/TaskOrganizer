import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ActivityType } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { ActivitiesScreen } from "./ActivitiesScreen";
import { AddActivitieScreen } from "./AddActivitieScreen";
import { EditActivityScreen } from "./EditActivityScreen";

export type RootStackParamList = {
  Activities: { activity: ActivityType };
  EditActivity: { activity: ActivityType };
  Add: any;
  Ajustes: any;
};

const Stack = createNativeStackNavigator();
export function ActivitiesStack() {
  const theme = useAppTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditActivity"
        component={EditActivityScreen}
        options={{
          title: "Editar atividade",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
      <Stack.Screen
        name="Add"
        component={AddActivitieScreen}
        options={{
          title: "Adicionar atividade",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
    </Stack.Navigator>
  );
}
