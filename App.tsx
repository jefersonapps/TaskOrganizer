import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivitiesStack } from "./src/screens/activities-screen/ActivitiesStack";
import { ConfigStack } from "./src/screens/config-stack/ConfigStack";
import Files from "./src/screens/files-screen/Files";
import { Reducer, useReducer, useState } from "react";
import {
  Action,
  ActionShedule,
  ActivityType,
  AppContext,
  File,
  LatexAction,
  LatexType,
  Scan,
  SheduleActivityType,
} from "./src/contexts/AppContext";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import { MyDarkTheme, MyTheme } from "./src/theme/Theme";
import { StatusBar } from "expo-status-bar";
import * as Notify from "expo-notifications";

import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { SheduleStack } from "./src/screens/shedule-screen/SheduleStack";

import { LatexStack } from "./src/screens/latex-screen/LatexStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QRCodeScreen } from "./src/screens/qr-code-screen/QRCodeScreen";
import { useEffect } from "react";
import { MMKV } from "react-native-mmkv";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GetPermission } from "./src/components/GetPermission";

import { LitLensStack } from "./src/screens/lit-lens/LitLensStack";
import * as LocalAuthentication from "expo-local-authentication";
import { ScrollView, View } from "react-native";
import LottieView from "lottie-react-native";

import * as Notifications from "expo-notifications";

import { AppRegistry } from "react-native";
import {
  registerWidgetTaskHandler,
  requestWidgetUpdate,
} from "react-native-android-widget";
import { expo as appExpo } from "./app.json";
const appName = appExpo.name;
import { widgetTaskHandler } from "./src/widgets/widget-work-manager";
import { DeliveryTimeWidget } from "./src/widgets/DeliveryTimeWidget";
import { TodoWidget } from "./src/widgets/TodoWidget";
import { CheckedTodosWidget } from "./src/widgets/CheckedTodosWidget";
import { AllTodosWidgets } from "./src/widgets/AllTodosWidgets";

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

  const activitiesReducer: Reducer<ActivityType[], Action> = (
    state,
    action
  ) => {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            id: action.id || Crypto.randomUUID(),
            text: action.text || "",
            priority: action.priority || "",
            timeStamp: action.timeStamp || "",
            isEdited: action.isEdited || false,
            deliveryDay: action.deliveryDay || "",
            deliveryTime: action.deliveryTime || "",
            title: action.title || "",
            checked: action.checked || false,
            notificationId: action.notificationId || null,
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

  const [activities, dispatchActivities] = useReducer(
    activitiesReducer,
    loadState("activities") || []
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
    saveState("theme", theme);
  }, [theme]);

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const initialSchedule: Record<string, SheduleActivityType[]> =
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as Record<string, SheduleActivityType[]>);

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
              id: Crypto.randomUUID(),
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
      case "reorder":
        return {
          ...state,
          [action.day]: action.activities,
        };
      default:
        throw new Error();
    }
  };

  const [schedule, dispatchSchedule] = useReducer(
    scheduleReducer,
    loadState("schedule") || initialSchedule
  );

  useEffect(() => {
    saveState("schedule", schedule);
  }, [schedule]);

  const latexReducer: Reducer<LatexType[], LatexAction> = (state, action) => {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            id: Crypto.randomUUID(),
            code: action.code ?? "",
            uri: action.uri ?? "",
          },
        ];
      case "delete":
        return state.filter((latex) => latex.id !== action.id);
      case "update":
        return state.map((latex) =>
          latex.id === action.id
            ? { ...latex, code: action.code ?? "", uri: action.uri ?? "" }
            : latex
        );
      case "reorder":
        return action.newOrder ?? state;
      default:
        throw new Error();
    }
  };

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

  useEffect(() => {
    requestWidgetUpdate({
      widgetName: "DeliveryTimeWidget",
      renderWidget: () => <DeliveryTimeWidget />,
      widgetNotFound: () => {
        console.log("not found");
        // Called if no widget is present on the home screen
      },
    });
    requestWidgetUpdate({
      widgetName: "TodoWidget",
      renderWidget: () => <TodoWidget />,
      widgetNotFound: () => {
        console.log("not found");
        // Called if no widget is present on the home screen
      },
    });
    requestWidgetUpdate({
      widgetName: "CheckedTodosWidget",
      renderWidget: () => <CheckedTodosWidget />,
      widgetNotFound: () => {
        console.log("not found");
        // Called if no widget is present on the home screen
      },
    });

    requestWidgetUpdate({
      widgetName: "AllTodosWidgets",
      renderWidget: () => <AllTodosWidgets />,
      widgetNotFound: () => {
        console.log("not found");
        // Called if no widget is present on the home screen
      },
    });
  }, [theme]);

  const [imageSource, setImageSource] = useState<string | null>("");
  const [ocrResult, setOcrResult] = useState("");

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

  async function handleAuthentication() {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login no TaskOrganizer",
      fallbackLabel: "Não foi possível desbloquear",
    });

    setIsAuthenticated(auth.success);
  }

  useEffect(() => {
    if (isBiometricEnabled && !isAuthenticated) {
      handleAuthentication();
    }
  }, [isBiometricEnabled, isAuthenticated]);

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

  if (notificationPermission === "denied") {
    return (
      <PaperProvider theme={theme}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <GetPermission
            getPermissionAfterSetInConfigs={requestNotificationPermission}
            title="Notificações não estão disponíveis"
            content="Desculpe, parece que não conseguimos enviar notificações para o seu dispositivo. Por favor, verifique as configurações de permissão de notificação e tente novamente."
          />
        </ScrollView>
        <StatusBar style={theme.dark ? "light" : "dark"} translucent />
      </PaperProvider>
    );
  }

  if (!isAuthenticated && isBiometricEnabled) {
    return (
      <PaperProvider theme={theme}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              padding: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card style={{ padding: 14 }}>
              <Card.Content>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 14 }}
                >
                  Login
                </Text>
                <Text style={{ textAlign: "justify" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    Aplicativo bloqueado!
                  </Text>{" "}
                  O TaskOrganizer está protegendo seus dados, por falor
                  desbloqueie o aplicativo.
                </Text>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LottieView
                    autoPlay
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    source={require("./src/lottie-files/locked-animation.json")}
                  />
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={handleAuthentication} mode="contained">
                  Desbloquear
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
        <StatusBar style={theme.dark ? "light" : "dark"} translucent />
      </PaperProvider>
    );
  }

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
              setTheme,
              equations,
              dispatchEquations,
              image,
              setImage,
              userName,
              setUserName,
              imageSource,
              setImageSource,
              ocrResult,
              setOcrResult,
              isBiometricEnabled,
              setIsBiometricEnabled,
              recentReaders,
              setRecentReaders,
              idOfNotification,
            }}
          >
            <Tab.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: theme.colors.customBackground },
                headerTintColor: theme.colors.primary,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarStyle: { backgroundColor: theme.colors.customBackground },
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
