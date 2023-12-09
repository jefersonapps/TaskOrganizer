import { List, IconButton, Text } from "react-native-paper";
import { getIconForFile, getColorForFile } from "../../helpers/helperFunctions";
import { Image, TouchableWithoutFeedback, View } from "react-native";
import { File } from "../../contexts/AppContext";
import { useState } from "react";

interface ListItemProps {
  file: File;
  onDelete: (fileUri: string) => void;
  onOpenFile: (id: string) => void;
  handleShareFile: (fileUri: string) => void;
}

export const ListItem = ({
  file,
  onDelete,
  onOpenFile,
  handleShareFile,
}: ListItemProps) => {
  const [isLongPressed, setIsLongPressed] = useState(false);
  return (
    <TouchableWithoutFeedback
      onLongPress={() => {
        setIsLongPressed(true);
        console.log("long press novo");
      }}
    >
      <List.Item
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
        right={(props) => (
          <IconButton
            {...props}
            icon={"delete"}
            onPress={() => onDelete(file.id)}
          />
        )}
        onPress={() => onOpenFile(file.uri)}
        onLongPress={() => {
          handleShareFile(file.uri);
        }}
      />
    </TouchableWithoutFeedback>
  );
};
