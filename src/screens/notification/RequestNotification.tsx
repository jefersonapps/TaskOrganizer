import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { GetPermission } from "../../components/GetPermission";
import { MyTheme } from "../../theme/Theme";

interface RequestNotificationProps {
  theme: MyTheme;
  requestNotificationPermission: () => {};
}

export const RequestNotification = ({
  theme,
  requestNotificationPermission,
}: RequestNotificationProps) => {
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
};
