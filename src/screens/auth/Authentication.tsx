import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import { MyTheme } from "../../theme/Theme";

interface AuthenticationProps {
  theme: MyTheme;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const Authentication = ({
  theme,
  setIsAuthenticated,
}: AuthenticationProps) => {
  async function handleAuthentication() {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login no TaskOrganizer",
      fallbackLabel: "Não foi possível desbloquear",
    });

    setIsAuthenticated(auth.success);
  }

  useEffect(() => {
    setTimeout(() => {
      handleAuthentication();
    }, 500);
  }, []);
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
                  source={require("../../lottie-files/locked-animation.json")}
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
};
