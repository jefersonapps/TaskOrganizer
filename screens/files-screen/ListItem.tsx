import { List, IconButton } from "react-native-paper";
import { getIconForFile, getColorForFile } from "../../helpers/helperFunctions";
import { Image } from "react-native";
import { File } from "../../contexts/AppContext";

interface ListItemProps {
  file: File;
  onDelete: (id: string) => void;
  onOpenFile: (id: string) => void;
}

export const ListItem = ({ file, onDelete, onOpenFile }: ListItemProps) => {
  return (
    <List.Item
      key={file.id}
      title={file.name}
      description="Toque para abrir"
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
            <List.Icon
              {...props}
              icon={getIconForFile(file)}
              color={getColorForFile(file)}
            />
          );
        }
      }}
      right={(props) => (
        <IconButton
          {...props}
          icon="delete"
          onPress={() => onDelete(file.id)}
        />
      )}
      onPress={() => onOpenFile(file.uri)}
    />
  );
};
