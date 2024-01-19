import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { handleVisitSite } from "../../../helpers/helperFunctions";
import { useAppTheme } from "../../../theme/Theme";

export const About = () => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <Text>from</Text>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => handleVisitSite("https://github.com/jefersonapps")}
      >
        <Text style={{ color: theme.colors.primary }}>Jeferson Leite</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 14,
  },
});
