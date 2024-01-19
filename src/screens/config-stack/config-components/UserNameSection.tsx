import { TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { TextInputComponent } from "../../../components/TextInputComponent";
import { useAppTheme } from "../../../theme/Theme";

interface UserNameSectionProps {
  userName: string;
  savedUserName: string;
  isEditing: boolean;
  onPressToUpdateName: () => void;
  onPressToOpenEditInput: () => void;
  onChangeText: (text: string) => void;
}

export const UserNameSection = ({
  userName,
  isEditing,
  onPressToUpdateName,
  onPressToOpenEditInput,
  onChangeText,
  savedUserName,
}: UserNameSectionProps) => {
  const theme = useAppTheme();
  return isEditing ? (
    <View
      style={{
        flexDirection: "row",
        gap: 16,
        width: "100%",
        alignItems: "center",
        padding: 14,
      }}
    >
      <View style={{ flex: 1 }}>
        <TextInputComponent
          label="Digite seu nome..."
          setText={onChangeText}
          text={userName}
          noMultiline
        />
      </View>
      <Button mode="contained" onPress={onPressToUpdateName}>
        Ok
      </Button>
    </View>
  ) : (
    <TouchableOpacity onPress={onPressToOpenEditInput}>
      <Text
        style={{
          fontSize: 20,
          marginVertical: 14,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        {savedUserName ? savedUserName : "Digite seu nome..."}
      </Text>
    </TouchableOpacity>
  );
};
