import { useMemo } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { IconButton, List } from "react-native-paper";
import { File } from "../../contexts/AppContext";
import { getColorForFile, getIconForFile } from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";
import { FilesMultipleDelete } from "./Files";

interface ListItemProps {
  file: File;
  onDelete: (fileUri: string) => void;
  onDrag?: () => void;
  isActive: boolean;
  onPress: (id: string, uri: string) => void;
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

  const isSelected = useMemo(
    () => selectedFiles.some((someFile) => someFile.id === file.id),
    [selectedFiles]
  );

  return (
    <View style={styles.container}>
      {selectedFiles.length > 0 && (
        <IconButton
          icon={isSelected ? "check" : "circle-outline"}
          mode={isSelected ? "contained" : "outlined"}
          onPress={() => {
            onPress(file.id, file.uri);
          }}
          style={{ marginLeft: 14 }}
        />
      )}
      <View style={{ flex: 1 }}>
        <List.Item
          style={{
            borderWidth: isActive ? 1 : 0,
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
                  style={[
                    styles.image,
                    {
                      marginLeft: props.style.marginLeft,
                      marginRight: props.style.marginRight,
                    },
                  ]}
                />
              );
            } else {
              return (
                <View style={styles.icon}>
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
            <View style={styles.dragIcon}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: { width: 25, height: 25, borderRadius: 5, alignSelf: "center" },
  icon: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dragIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -20,
  },
});
