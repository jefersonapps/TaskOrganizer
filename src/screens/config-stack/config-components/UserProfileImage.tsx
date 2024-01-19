import { MaterialIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../../../theme/Theme";

interface UserProfileImageProps {
  image: string | null;
  onPress: () => void;
}

export const UserProfileImage = ({ image, onPress }: UserProfileImageProps) => {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ borderColor: "#34d399", borderWidth: 4, borderRadius: 9999 }}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      ) : (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderColor: "#34d399",
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons
            name="person"
            size={60}
            color={theme.colors.onPrimaryContainer}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
