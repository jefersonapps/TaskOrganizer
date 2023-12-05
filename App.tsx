import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivitiesStack } from "./screens/activities-screen/ActivitiesStack";
import { ConfigStack } from "./screens/config-stack/ConfigStack";
import Files from "./screens/files-screen/Files";
import { Reducer, useReducer, useState } from "react";
import {
  Action,
  ActionShedule,
  ActivityType,
  AppContext,
  File,
  LatexAction,
  LatexType,
  SheduleActivityType,
} from "./contexts/AppContext";
import { Provider as PaperProvider } from "react-native-paper";
import { MyDarkTheme, MyLightTheme, MyTheme } from "./theme/Theme";
import { StatusBar } from "expo-status-bar";
import * as Notify from "expo-notifications";

import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { SheduleStack } from "./screens/shedule-screen/SheduleStack";

import { LatexStack } from "./screens/latex-screen/LatexStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QRCodeScreen } from "./screens/qr-code-screen/QRCodeScreen";

const Tab = createBottomTabNavigator();

Notify.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

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
            checked: action.checked || false,
          },
        ];
      case "delete":
        return state.filter((activity) => activity.id !== action.id);
      case "update":
        return state.map((activity) =>
          activity.id === action.activity?.id ? action.activity : activity
        );
      case "check":
        return state.map((activity) =>
          activity.id === action.id
            ? { ...activity, checked: !activity.checked }
            : activity
        );
      default:
        throw new Error();
    }
  };

  const [activities, dispatchActivities] = useReducer(activitiesReducer, []);

  const [files, setFiles] = useState<File[]>([]);

  const [theme, setTheme] = useState<MyTheme>(MyDarkTheme);

  // Criando o reducer
  const scheduleReducer: Reducer<
    Record<string, SheduleActivityType[]>,
    ActionShedule
  > = (state, action) => {
    switch (action.type) {
      case "add":
        return {
          ...state,
          [action.day]: [
            ...(state[action.day] || []),
            {
              id: Math.random().toString(),
              text: action.text || "",
              title: action.title || "",
            },
          ],
        };
      case "delete":
        return {
          ...state,
          [action.day]: (state[action.day] || []).filter(
            (activity) => activity.id !== action.id
          ),
        };
      case "update":
        return {
          ...state,
          [action.day]: (state[action.day] || []).map((activity) =>
            activity.id === action.activity?.id ? action.activity : activity
          ),
        };
      default:
        throw new Error();
    }
  };

  const [schedule, dispatchSchedule] = useReducer(scheduleReducer, {});

  const latexReducer: Reducer<LatexType[], LatexAction> = (state, action) => {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            id: Crypto.randomUUID(),
            code: action.code ?? "",
          },
        ];
      case "delete":
        return state.filter((latex) => latex.id !== action.id);
      case "update":
        return state.map((latex) =>
          latex.id === action.id ? { ...latex, code: action.code ?? "" } : latex
        );
      default:
        throw new Error();
    }
  };

  const [equations, dispatchEquations] = useReducer(latexReducer, []);
  const [image, setImage] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme((theme) => (theme === MyLightTheme ? MyDarkTheme : MyLightTheme));
  };

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppContext.Provider
            value={{
              activities,
              activitiesDispatch: dispatchActivities,
              sheduleDispatch: dispatchSchedule,
              schedule,
              files,
              setFiles,
              toggleTheme,
              equations,
              dispatchEquations,
              image,
              setImage,
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
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name="Agenda"
                component={SheduleStack}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons
                      name="calendar-outline"
                      color={color}
                      size={size}
                    />
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
                name="LaTeX"
                component={LatexStack}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="code" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="QR"
                component={QRCodeScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="qr-code" color={color} size={size} />
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
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default App;
export { AppContext };
