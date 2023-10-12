import { useCallback, useContext } from "react";
import { View } from "react-native";
import { Card, Chip, IconButton, Paragraph, Title } from "react-native-paper";
import { ActivityType, AppContext } from "../../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./ActivitiesStack";
import { formatTimeStamp } from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";

type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

interface CardComponentProps {
  item: ActivityType;
  handleDelete: (id: string) => void;
}

export const CardComponent = ({ item, handleDelete }: CardComponentProps) => {
  const { activities } = useContext(AppContext);
  const navigation = useNavigation<ActivitiesNavigation>();
  const handleEdit = useCallback((id: string) => {
    const activity = activities.find((a) => a.id === id);
    if (activity) {
      navigation.navigate("EditActivity", { activity });
    }
  }, []);

  const priorityColors = {
    alta: "#dc2626",
    media: "#ea580c",
    baixa: "#06b6d4",
  };

  const theme = useAppTheme();
  return (
    <View style={{ flex: 1, alignItems: "stretch" }}>
      <Card
        style={{
          margin: 10,
          borderLeftWidth: 10,
          borderLeftColor:
            priorityColors[item.priority as keyof typeof priorityColors],

          borderTopWidth: theme.dark ? 1 : 0,
          borderTopColor: theme.dark ? "gray" : undefined,
          borderBottomWidth: theme.dark ? 1 : 0,
          borderBottomColor: theme.dark ? "#4d4b4b" : undefined,
          borderRightWidth: theme.dark ? 1 : 0,
          borderRightColor: theme.dark ? "#4d4b4b" : undefined,
        }}
      >
        <Card.Content>
          {/* <Icon name="priority-high" color={priorityColors[item.priority]} /> */}
          <Chip icon="clock-outline">
            {item.isEdited ? "Editada" : "Criada"} em:{" "}
            {formatTimeStamp(item.timeStamp)}
          </Chip>
          <View style={{ paddingVertical: 10 }}>
            {item.title && <Title>{item.title}</Title>}
            <Paragraph>{item.text}</Paragraph>
          </View>

          {item.deliveryDay && (
            <Chip icon="calendar-clock">
              Prazo: {item.deliveryDay} {item.deliveryTime && "às"}{" "}
              {item.deliveryTime.slice(0, -3)}
            </Chip>
          )}
        </Card.Content>
        <Card.Actions>
          <IconButton icon="pencil" onPress={() => handleEdit(item.id)} />
          <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
        </Card.Actions>
      </Card>
    </View>
  );
};
