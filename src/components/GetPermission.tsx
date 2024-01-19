import * as Linking from "expo-linking";
import { StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { useAppTheme } from "../theme/Theme";

interface GetPermissionTypes {
  title: string;
  content: string;
  getPermissionAfterSetInConfigs: () => {};
}

export const GetPermission = ({
  title,
  content,
  getPermissionAfterSetInConfigs,
}: GetPermissionTypes) => {
  const theme = useAppTheme();

  async function getPermissionAgain() {
    Linking.openSettings();
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={{ padding: 20, maxWidth: 300 }}>
        <Card.Title title="Aviso" />
        <Card.Content>
          <Title>{title}</Title>
          <Paragraph style={{ textAlign: "justify" }}>{content}</Paragraph>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
