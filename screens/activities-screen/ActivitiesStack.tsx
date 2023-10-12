import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ActivitiesScreen } from "./ActivitiesScreen";
import { EditActivityScreen } from "./EditActivityScreen";
import { AddActivitieScreen } from "./AddActivitieScreen";
import { useAppTheme } from "../../theme/Theme";
import { ActivityType } from "../../contexts/AppContext";

export type RootStackParamList = {
  Activities: { activity: ActivityType };
  EditActivity: { activity: ActivityType };
  Add: any;
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
