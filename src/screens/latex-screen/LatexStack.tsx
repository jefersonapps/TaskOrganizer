import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LatexType } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { AddLatexScreen } from "./AddLatexScreen";
import { EditLatexScreen } from "./EditLatexScreen";
import { LatexScreen } from "./LatexScreen";

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
