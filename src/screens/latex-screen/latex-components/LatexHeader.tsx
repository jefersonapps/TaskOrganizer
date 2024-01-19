import { StatusBar, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../../theme/Theme";

export const LatexHeader = () => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.customBackground,
          borderBottomWidth: 2,
          borderBottomColor: theme.colors.surfaceDisabled,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.primary,
          },
        ]}
      >
        Equações
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingHorizontal: 14,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 32 + 8,
  },
  text: { fontSize: 20, fontWeight: "bold", paddingVertical: 4 },
});
