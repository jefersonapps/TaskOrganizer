import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { AddActivitieScreen } from "./AddActivitieScreen";
import { useAppTheme } from "../../theme/Theme";
// import { ActivityType, SheduleActivityType } from "../../contexts/AppContext";
import { LatexScreen } from "./LatexScreen";
import { AddLatexScreen } from "./AddLatexScreen";
import { LatexType } from "../../contexts/AppContext";
import { EditLatexScreen } from "./EditLatexScreen";

export type RootStackLatexParamList = {
  LatexScreen: { latexItem: LatexType };
  AddLatexActivityScreen: any;
  EditLatexScreen: { latexItem: LatexType };
};

const Stack = createNativeStackNavigator();

export function LatexStack() {
  const theme = useAppTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LatexScreen"
        component={LatexScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddLatexActivityScreen"
        component={AddLatexScreen}
        options={{
          title: "Adicionar conteúdo em LaTeX",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
      <Stack.Screen
        name="EditLatexScreen"
        component={EditLatexScreen}
        options={{
          title: "Editar código LaTeX",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />
    </Stack.Navigator>
  );
}
