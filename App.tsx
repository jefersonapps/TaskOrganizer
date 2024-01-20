import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as Notify from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useReducer, useState } from "react";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import {
  AppContext,
  File,
  Scan,
  ScheduleActivityType,
} from "./src/contexts/AppContext";
import { ActivitiesStack } from "./src/screens/activities-screen/ActivitiesStack";
import { ConfigStack } from "./src/screens/config-stack/ConfigStack";
import Files from "./src/screens/files-screen/Files";
import { MyDarkTheme, MyTheme } from "./src/theme/Theme";

import { Ionicons } from "@expo/vector-icons";
import { ScheduleStack } from "./src/screens/schedule-screen/ScheduleStack";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";
import { LatexStack } from "./src/screens/latex-screen/LatexStack";
import { QRCodeScreen } from "./src/screens/qr-code-screen/QRCodeScreen";

import { LitLensStack } from "./src/screens/lit-lens/LitLensStack";

import * as Notifications from "expo-notifications";

import * as NavigationBar from "expo-navigation-bar";

import { AppRegistry } from "react-native";
import {
  registerWidgetTaskHandler,
  requestWidgetUpdate,
} from "react-native-android-widget";
import { expo as appExpo } from "./app.json";
import { daysOfWeek } from "./src/constants/constants";
import { activitiesReducer } from "./src/reducers/activitiesReducer";
import { latexReducer } from "./src/reducers/latexReducer";
import { scheduleReducer } from "./src/reducers/scheduleReducer";
import { Authentication } from "./src/screens/auth/Authentication";
import { RequestNotification } from "./src/screens/notification/RequestNotification";
import { AllTodosWidgets } from "./src/widgets/AllTodosWidgets";
import { CheckedTodosWidget } from "./src/widgets/CheckedTodosWidget";
import { DeliveryTimeWidget } from "./src/widgets/DeliveryTimeWidget";
import { TodoWidget } from "./src/widgets/TodoWidget";
import { widgetTaskHandler } from "./src/widgets/widget-work-manager";
const appName = appExpo.name;

// Cria uma nova instância de armazenamento
export const storage = new MMKV();

// Função para salvar o estado no armazenamento local
export const saveState = <T extends unknown>(key: string, state: T) => {
  storage.set(key, JSON.stringify(state));
};

// Função para recuperar o estado do armazenamento local
export const loadState = <T extends unknown>(key: string): T | undefined => {
  const state = storage.getString(key);
  return state ? (JSON.parse(state) as T) : undefined;
};

const Tab = createBottomTabNavigator();

registerWidgetTaskHandler(widgetTaskHandler);

function App() {
  const [idOfNotification, setIdOfNotification] = useState(null);

  const [activities, dispatchActivities] = useReducer(
    activitiesReducer,
    loadState("activities") || {
      todos: [],
      checkedTodos: [],
      withDeadLine: [],
      withPriority: [],
    }
  );

  useEffect(() => {
    saveState("activities", activities);
  }, [activities]);

  const [files, setFiles] = useState<File[]>(loadState("files") || []);

  useEffect(() => {
    saveState("files", files);
  }, [files]);

  const [theme, setTheme] = useState<MyTheme>(
    loadState("theme") || MyDarkTheme
  );

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.customBackground);
    saveState("theme", theme);
  }, [theme]);

  const initialSchedule: Record<string, ScheduleActivityType[]> =
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as Record<string, ScheduleActivityType[]>);

  const [schedule, dispatchSchedule] = useReducer(
    scheduleReducer,
    loadState("schedule") || initialSchedule
  );

  useEffect(() => {
    saveState("schedule", schedule);
  }, [schedule]);

  const [equations, dispatchEquations] = useReducer(
    latexReducer,
    loadState("equations") || []
  );
  useEffect(() => {
    saveState("equations", equations);
  }, [equations]);

  const [image, setImage] = useState<string | null>(loadState("image") || null);

  useEffect(() => {
    saveState("image", image);
  }, [image]);

  const [userName, setUserName] = useState<string>(loadState("userName") || "");

  useEffect(() => {
    saveState("userName", userName);
  }, [userName]);

  const [recentReaders, setRecentReaders] = useState<Scan[]>(
    loadState("recentReaders") || []
  );
  useEffect(() => {
    saveState("recentReaders", recentReaders);
  }, [recentReaders]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    loadState("isBiometricEnabled") || false
  );

  useEffect(() => {
    saveState("isBiometricEnabled", isBiometricEnabled);
  }, [isBiometricEnabled]);

  const [notificationPermission, setNotificationPermission] = useState<
    string | null
  >(null);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermission(status);
    };

    checkNotificationPermission();
  }, [notificationPermission]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    setNotificationPermission(status);
  };

  useEffect(() => {
    Notify.setNotificationHandler({
      handleNotification: async (notification) => {
        const { id } = notification.request.content.data;

        setIdOfNotification(id);

        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });
  }, []);

  useEffect(() => {
    requestWidgetUpdate({
      widgetName: "DeliveryTimeWidget",
      renderWidget: () => <DeliveryTimeWidget />,
    });
    requestWidgetUpdate({
      widgetName: "TodoWidget",
      renderWidget: () => <TodoWidget />,
    });
    requestWidgetUpdate({
      widgetName: "CheckedTodosWidget",
      renderWidget: () => <CheckedTodosWidget />,
    });

    requestWidgetUpdate({
      widgetName: "AllTodosWidgets",
      renderWidget: () => <AllTodosWidgets />,
    });
  }, [theme]);

  if (notificationPermission === "denied") {
    return (
      <RequestNotification
        theme={theme}
        requestNotificationPermission={requestNotificationPermission}
      />
    );
  }

  if (!isAuthenticated && isBiometricEnabled) {
    return (
      <Authentication theme={theme} setIsAuthenticated={setIsAuthenticated} />
    );
  }

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: theme.colors.customBackground }}
      >
        <NavigationContainer>
          <AppContext.Provider
            value={{
              activities,
              activitiesDispatch: dispatchActivities,
              scheduleDispatch: dispatchSchedule,
              schedule,
              files,
              setFiles,
              setTheme,
              equations,
              dispatchEquations,
              image,
              setImage,
              userName,
              setUserName,
              isBiometricEnabled,
              setIsBiometricEnabled,
              recentReaders,
              setRecentReaders,
              idOfNotification,
              isAuthenticated,
              setIsAuthenticated,
            }}
          >
            <Tab.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.customBackground,
                },
                headerTintColor: theme.colors.primary,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarStyle: {
                  backgroundColor: theme.colors.customBackground,
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
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
                name="Agenda"
                component={ScheduleStack}
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
                name="LitLens"
                component={LitLensStack}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="google-lens"
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Ajustes"
                component={ConfigStack}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          </AppContext.Provider>
        </NavigationContainer>
        <StatusBar style={theme.dark ? "light" : "dark"} translucent />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
export { AppContext };
