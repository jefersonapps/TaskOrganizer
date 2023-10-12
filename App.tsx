import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivitiesStack } from "./screens/activities-screen/ActivitiesStack";
import { ConfigStack } from "./screens/config-stack/ConfigStack";
import Files from "./screens/files-screen/Files";
import { Reducer, useReducer, useState } from "react";
import { Action, ActivityType, AppContext, File } from "./contexts/AppContext";
import { Provider as PaperProvider } from "react-native-paper";
import { MyDarkTheme, MyLightTheme, MyTheme } from "./theme/Theme";
import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";

const Tab = createBottomTabNavigator();

function App() {
  const activitiesReducer: Reducer<ActivityType[], Action> = (
    state,
    action
  ) => {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            id: Crypto.randomUUID(),
            text: action.text || "",
            priority: action.priority || "",
            timeStamp: action.timeStamp || "",
            isEdited: action.isEdited || false,
            deliveryDay: action.deliveryDay || "",
            deliveryTime: action.deliveryTime || "",
            title: action.title || "",
          },
        ];
      case "delete":
        return state.filter((activity) => activity.id !== action.id);
      case "update":
        return state.map((activity) =>
          activity.id === action.activity?.id ? action.activity : activity
        );
      default:
        throw new Error();
    }
  };

  const [activities, dispatchActivities] = useReducer(activitiesReducer, []);
  const [files, setFiles] = useState<File[]>([]);

  const [theme, setTheme] = useState<MyTheme>(MyLightTheme);

  const toggleTheme = () => {
    setTheme((theme) => (theme === MyLightTheme ? MyDarkTheme : MyLightTheme));
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppContext.Provider
          value={{
            activities,
            activitiesDispatch: dispatchActivities,
            files,
            setFiles,
            toggleTheme,
          }}
        >
          <Tab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.customBackground },
              headerTintColor: theme.colors.primary,
              tabBarActiveTintColor: theme.colors.primary,
              tabBarStyle: { backgroundColor: theme.colors.customBackground },
            }}
          >
            <Tab.Screen
              name="Atividades"
              component={ActivitiesStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="list" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Arquivos"
              component={Files}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="folder" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Ajustes"
              component={ConfigStack}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </AppContext.Provider>
      </NavigationContainer>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperProvider>
  );
}

export default App;
export { AppContext };
