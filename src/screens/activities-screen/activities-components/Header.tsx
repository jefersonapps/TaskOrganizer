import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Title } from "react-native-paper";
import { useAppTheme } from "../../../theme/Theme";

interface HeaderProps {
  greeting: string;
  image: string | null;
  onImagePress: () => void;
}
export const Header = ({ greeting, image, onImagePress }: HeaderProps) => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <Title
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        {greeting}!
      </Title>
      <TouchableOpacity activeOpacity={0.8} onPress={onImagePress}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.avatar}>
            <MaterialIcons
              name="person"
              size={30}
              color={theme.colors.onPrimaryContainer}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#34d399",
    borderWidth: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#34d399",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
