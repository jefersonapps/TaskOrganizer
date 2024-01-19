import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as Notify from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { Reducer, useReducer, useState } from "react";
import "react-native-gesture-handler";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import {
  Action,
  ActionShedule,
  ActivityState,
  ActivityType,
  AppContext,
  File,
  LatexAction,
  LatexType,
  Scan,
  SheduleActivityType,
} from "./src/contexts/AppContext";
import { ActivitiesStack } from "./src/screens/activities-screen/ActivitiesStack";
import { ConfigStack } from "./src/screens/config-stack/ConfigStack";
import Files from "./src/screens/files-screen/Files";
import { MyDarkTheme, MyTheme } from "./src/theme/Theme";

import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { SheduleStack } from "./src/screens/shedule-screen/SheduleStack";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";
import { GetPermission } from "./src/components/GetPermission";
import { LatexStack } from "./src/screens/latex-screen/LatexStack";
import { QRCodeScreen } from "./src/screens/qr-code-screen/QRCodeScreen";

import * as LocalAuthentication from "expo-local-authentication";
import LottieView from "lottie-react-native";
import { ScrollView, View } from "react-native";
import { LitLensStack } from "./src/screens/lit-lens/LitLensStack";

import * as Notifications from "expo-notifications";

import { AppRegistry } from "react-native";
import {
  registerWidgetTaskHandler,
  requestWidgetUpdate,
} from "react-native-android-widget";
import { expo as appExpo } from "./app.json";
import { priorityLevels } from "./src/constants/constants";
import { convertToDateTime } from "./src/helpers/helperFunctions";
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

  const activitiesReducer: Reducer<ActivityState, Action> = (state, action) => {
    switch (action.type) {
      case "add":
        const newActivity = {
          id: action.id || Crypto.randomUUID(),
          text: action.text || "",
          priority: action.priority || "baixa",
          timeStamp: action.timeStamp || "",
          isEdited: action.isEdited || false,
          deliveryDay: action.deliveryDay || "",
          deliveryTime: action.deliveryTime || "",
          title: action.title || "",
          checked: action.checked || false,
          notificationId: action.notificationId || null,
        };

        let newWithDeadLine = state.withDeadLine;
        if (newActivity.deliveryDay) {
          newWithDeadLine = [...newWithDeadLine, newActivity];
          newWithDeadLine.sort((a, b) => {
            const dateTimeA = convertToDateTime(a.deliveryDay, a.deliveryTime);
            const dateTimeB = convertToDateTime(b.deliveryDay, b.deliveryTime);
            return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
          });
        }

        let newWithPriority = state.withPriority;
        if (newActivity.priority) {
          newWithPriority = [...newWithPriority, newActivity];
          newWithPriority.sort((a, b) => {
            return priorityLevels[b.priority] - priorityLevels[a.priority];
          });
        }

        return {
          todos: newActivity.checked
            ? state.todos
            : [...state.todos, newActivity],
          checkedTodos: newActivity.checked
            ? [...state.checkedTodos, newActivity]
            : state.checkedTodos,
          withDeadLine: newWithDeadLine,
          withPriority: newWithPriority,
        };

      case "delete":
        return {
          todos: state.todos.filter((activity) => activity.id !== action.id),
          checkedTodos: state.checkedTodos.filter(
            (activity) => activity.id !== action.id
          ),
          withDeadLine: state.withDeadLine.filter(
            (activity) => activity.id !== action.id
          ),
          withPriority: state.withPriority.filter(
            (activity) => activity.id !== action.id
          ),
        };
      case "update":
        const updateActivity = (activities: ActivityType[]) =>
          activities.map((activity) =>
            activity.id === action.activity?.id ? action.activity : activity
          );

        let updatedWithDeadLine = updateActivity(state.withDeadLine);
        if (action.activity?.deliveryDay) {
          updatedWithDeadLine.sort((a, b) => {
            const dateTimeA = convertToDateTime(a.deliveryDay, a.deliveryTime);
            const dateTimeB = convertToDateTime(b.deliveryDay, b.deliveryTime);
            return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
          });
        }

        let updatedWithPriority = updateActivity(state.withPriority);
        if (action.activity?.priority) {
          updatedWithPriority.sort((a, b) => {
            return priorityLevels[b.priority] - priorityLevels[a.priority];
          });
        }

        return {
          todos: updateActivity(state.todos),
          checkedTodos: updateActivity(state.checkedTodos),
          withDeadLine: updatedWithDeadLine,
          withPriority: updatedWithPriority,
        };

      case "check":
        const activityToCheck =
          state.todos.find((activity) => activity.id === action.id) ||
          state.checkedTodos.find((activity) => activity.id === action.id) ||
          state.withDeadLine.find((activity) => activity.id === action.id) ||
          state.withPriority.find((activity) => activity.id === action.id);

        if (!activityToCheck) {
          throw new Error(`Activity with id ${action.id} not found`);
        }

        const checkedActivity = {
          ...activityToCheck,
          checked: !activityToCheck.checked,
        };

        return {
          todos: checkedActivity.checked
            ? state.todos.filter((activity) => activity.id !== action.id)
            : [...state.todos, checkedActivity],
          checkedTodos: checkedActivity.checked
            ? [...state.checkedTodos, checkedActivity]
            : state.checkedTodos.filter(
                (activity) => activity.id !== action.id
              ),
          withDeadLine:
            checkedActivity.deliveryDay &&
            !state.withDeadLine.find((activity) => activity.id === action.id)
              ? [...state.withDeadLine, checkedActivity]
              : state.withDeadLine.filter(
                  (activity) => activity.id !== action.id
                ),
          withPriority:
            checkedActivity.priority &&
            !state.withPriority.find((activity) => activity.id === action.id)
              ? [...state.withPriority, checkedActivity]
              : state.withPriority.filter(
                  (activity) => activity.id !== action.id
                ),
        };

      case "reorder": {
        if (typeof action.listName !== "string") {
          throw new Error(
            `Expected listName to be a string, got ${typeof action.listName}`
          );
        }
        return {
          ...state,
          [action.listName]: action.newOrder,
        };
      }

      default:
        throw new Error();
    }
  };

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
              priority: action.priority || "baixa",
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
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 14,
                  }}
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
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: theme.colors.customBackground }}
      >
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
