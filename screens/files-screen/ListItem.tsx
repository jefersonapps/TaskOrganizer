import { List, IconButton, ThemeProvider } from "react-native-paper";
import { getIconForFile, getColorForFile } from "../../helpers/helperFunctions";
import { Image, Pressable, View } from "react-native";
import { File } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { FilesMultipleDelete } from "./Files";

interface ListItemProps {
  file: File;
  onDelete: (fileUri: string) => void;
  onDrag?: () => void;
  isActive: boolean;
  onPress: (id: string) => void;
  selectedFiles: FilesMultipleDelete[];
}

export const ListItem = ({
  file,
  onDelete,
  onDrag,
  isActive,
  onPress,
  selectedFiles,
}: ListItemProps) => {
  const theme = useAppTheme();

  const isSelected = selectedFiles.some((someFile) => someFile.id === file.id);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {selectedFiles.length > 0 && (
        <IconButton
          icon={isSelected ? "check" : "circle-outline"}
          mode={isSelected ? "contained" : "outlined"}
          onPress={() => {
            onPress(file.id);
          }}
          style={{ marginLeft: 14 }}
        />
      )}
      <View style={{ flex: 1 }}>
        <List.Item
          style={{
            borderWidth: 1,
            borderColor: isActive ? theme.colors.primary : theme.colors.surface,
            backgroundColor: isActive ? theme.colors.surface : undefined,
            borderRadius: 14,
          }}
          key={file.id}
          title={file.name}
          description="Toque para abrir, segure para compartilhar"
          left={(props) => {
            const extension = file.name.split(".").pop();
            if (["jpg", "jpeg", "png", "gif"].includes(String(extension))) {
              return (
                <Image
                  source={{ uri: file.uri }}
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: props.style.marginLeft,
                    marginRight: props.style.marginRight,
                    alignSelf: "center",
                    borderRadius: 5,
                  }}
                />
              );
            } else {
              return (
                <View
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <List.Icon
                    {...props}
                    icon={getIconForFile(file)}
                    color={getColorForFile(file)}
                  />
                </View>
              );
            }
          }}
          right={() => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Pressable onLongPress={onDrag}>
                <IconButton icon="drag" mode="contained" />
              </Pressable>
              <IconButton
                icon="delete"
                onPress={() => onDelete(file.id)}
                mode="contained"
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};
