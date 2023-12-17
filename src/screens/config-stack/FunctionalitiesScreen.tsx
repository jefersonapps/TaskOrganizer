import { View } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { Text } from "react-native-paper";

export function FunctionalitiesScreen() {
  const theme = useAppTheme();
  return (
    <View
      style={{ flex: 1, padding: 14, backgroundColor: theme.colors.surface }}
    >
      <Text>Functionalities Screen</Text>
      <Text>(Falta fazer)</Text>
    </View>
  );
}
