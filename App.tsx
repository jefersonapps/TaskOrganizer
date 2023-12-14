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
  Scan,
  SheduleActivityType,
} from "./contexts/AppContext";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import { MyDarkTheme, MyLightTheme, MyTheme } from "./theme/Theme";
import { StatusBar } from "expo-status-bar";
import * as Notify from "expo-notifications";

import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { SheduleStack } from "./screens/shedule-screen/SheduleStack";

import { LatexStack } from "./screens/latex-screen/LatexStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QRCodeScreen } from "./screens/qr-code-screen/QRCodeScreen";
import { useEffect } from "react";
import { MMKV } from "react-native-mmkv";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { GetPermission } from "./components/GetPermission";
import { useNotificationPermission } from "./Hooks/usePermission";
import { LitLensStack } from "./screens/lit-lens/LitLensStack";
import * as LocalAuthentication from "expo-local-authentication";
import { View } from "react-native";
import LottieView from "lottie-react-native";

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

Notify.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

function App() {
  const { notificationPermission, requestNotificationPermission } =
    useNotificationPermission();

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
          },
        ];
      case "delete":
        return state.filter((latex) => latex.id !== action.id);
      case "update":
        return state.map((latex) =>
          latex.id === action.id ? { ...latex, code: action.code ?? "" } : latex
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

  const [galeryPermission, setGaleryPermission] =
    useState<ImagePicker.PermissionStatus>();

  const [cameraPermission, setCameraPermission] =
    useState<ImagePicker.PermissionStatus>();

  const toggleTheme = () => {
    setTheme((theme) => (theme === MyLightTheme ? MyDarkTheme : MyLightTheme));
  };

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

  if (!isAuthenticated && isBiometricEnabled) {
    return (
      <PaperProvider theme={theme}>
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
                  source={require("./lottie-files/locked-animation.json")}
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
      </PaperProvider>
    );
  }

  if (notificationPermission === "denied") {
    return (
      <PaperProvider theme={theme}>
        <GetPermission
          getPermissionAfterSetInConfigs={requestNotificationPermission}
          title="Notificações não estão disponíveis"
          content="Desculpe, parece que não conseguimos enviar notificações para o seu dispositivo. Por favor, verifique as configurações de permissão de notificação e tente novamente."
        />
        <StatusBar style={theme.dark ? "light" : "dark"} />
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
              toggleTheme,
              equations,
              dispatchEquations,
              image,
              setImage,
              userName,
              setUserName,
              galeryPermission,
              setGaleryPermission,
              cameraPermission,
              setCameraPermission,
              imageSource,
              setImageSource,
              ocrResult,
              setOcrResult,
              isBiometricEnabled,
              setIsBiometricEnabled,
              recentReaders,
              setRecentReaders,
            }}
          >
            <Tab.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: theme.colors.customBackground },
                headerTintColor: theme.colors.primary,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarStyle: { backgroundColor: theme.colors.customBackground },
                headerShown: false,
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
        <StatusBar style={theme.dark ? "light" : "dark"} />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default App;
export { AppContext };
