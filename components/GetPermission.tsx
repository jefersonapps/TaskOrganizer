import { View } from "react-native";
import { useAppTheme } from "../theme/Theme";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import * as Linking from "expo-linking";

interface GetPermissionTypes {
  getPermissionAfterSetInConfigs: () => {};
}

export const GetPermission = ({
  getPermissionAfterSetInConfigs,
}: GetPermissionTypes) => {
  const theme = useAppTheme();

  async function getPermissionAgain() {
    Linking.openSettings();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Card style={{ padding: 20, maxWidth: 300 }}>
        <Card.Title title="Aviso" />
        <Card.Content>
          <Title>A câmera não está disponível</Title>
          <Paragraph>
            Desculpe, parece que não conseguimos acessar a câmera do seu
            dispositivo. Por favor, verifique as configurações de permissão da
            câmera e tente novamente.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Button
              mode="contained"
              onPress={getPermissionAgain}
              style={{ marginTop: 14 }}
            >
              Verificar permissões
            </Button>
            <Button
              mode="outlined"
              style={{ marginTop: 14 }}
              onPress={getPermissionAfterSetInConfigs}
            >
              Ativei agora
            </Button>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
};
