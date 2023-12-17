import { useCallback, useContext, useState } from "react";
import { Pressable, TouchableNativeFeedback, View } from "react-native";
import {
  Badge,
  Card,
  Chip,
  IconButton,
  Paragraph,
  Snackbar,
  Text,
  Title,
} from "react-native-paper";
import {
  ActivityType,
  AppContext,
  NotificationIdType,
} from "../../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./ActivitiesStack";
import { formatTimeStamp } from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";
import * as Haptics from "expo-haptics";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import utc from "dayjs/plugin/utc"; // Importando o plugin utc
dayjs.extend(utc);
import timezone from "dayjs/plugin/timezone";
import { ActivityMultipleDelete } from "./ActivitiesScreen";
dayjs.extend(timezone);

type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

interface CardComponentProps {
  item: ActivityType;
  handleDelete: (id: string, identifier: NotificationIdType) => void;
  checkActivity: (id: string, identifier: NotificationIdType) => void;
  onLongPress: (id: string, identifier: NotificationIdType) => void;
  onPress: (id: string, identifier: NotificationIdType) => void;
  selectedActivities: ActivityMultipleDelete[];
  isActive?: boolean;
  onDrag?: () => void;
}

export const CardComponent = ({
  item,
  handleDelete,
  checkActivity,
  onLongPress,
  isActive,
  onPress,
  selectedActivities,
  onDrag,
}: CardComponentProps) => {
  const { activities, idOfNotification } = useContext(AppContext);
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

  const deliveryDateTime = dayjs.utc(
    `${item.deliveryDay} ${item.deliveryTime ? item.deliveryTime : "00:00:00"}`,
    "DD/MM/YYYY HH:mm:ss"
  );
  const now = dayjs().utc(true);

  let status;
  let color;

  if (now.isBefore(deliveryDateTime, "day")) {
    status = "Prazo: ";
    color = theme.colors.surfaceVariant;
  } else if (now.isSame(deliveryDateTime, "day")) {
    if (now.isBefore(deliveryDateTime, "minute")) {
      status = "Expira hoje: ";
      color = theme.dark
        ? theme.colors.tertiaryContainer
        : theme.colors.errorContainer;
    } else {
      status = "Expirada: ";
      color = theme.dark
        ? theme.colors.errorContainer
        : theme.colors.tertiaryContainer;
    }
  } else {
    status = "Expirada: ";
    color = theme.dark
      ? theme.colors.errorContainer
      : theme.colors.tertiaryContainer;
  }

  const isSelected = selectedActivities.some(
    (activity) => activity.id === item.id
  );

  const [snackVisible, setSnackVisible] = useState(false);

  const onToggleSnackBar = () => setSnackVisible(!snackVisible);

  const onDismissSnackBar = () => setSnackVisible(false);

  return (
    <TouchableNativeFeedback
      onPress={() => {
        onPress(item.id, item.notificationId ? item.notificationId : null);
      }}
      onLongPress={() => {
        onLongPress(item.id, item.notificationId ? item.notificationId : null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
      background={TouchableNativeFeedback.Ripple("#807e7e15", false)}
      useForeground
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {selectedActivities.length > 0 && (
          <IconButton
            icon={isSelected ? "check" : "circle-outline"}
            mode={isSelected ? "contained" : "outlined"}
            onPress={() => {
              onPress(
                item.id,
                item.notificationId ? item.notificationId : null
              );
            }}
            style={{ marginLeft: 14 }}
          />
        )}
        <View
          style={{
            flex: 1,
            alignItems: "stretch",
            position: "relative",
          }}
        >
          {idOfNotification === item.id && (
            <Badge
              onPress={onToggleSnackBar}
              style={{ position: "absolute", zIndex: 999, right: 14, top: 0 }}
            >
              !
            </Badge>
          )}

          <Snackbar
            style={{
              zIndex: 999,
              backgroundColor: theme.colors.surfaceVariant,
            }}
            visible={snackVisible}
            onDismiss={onDismissSnackBar}
            action={{
              label: "Fechar",
              onPress: onDismissSnackBar,
              mode: "contained",
            }}
          >
            <Text>A atividade está expirada!</Text>
          </Snackbar>
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
              borderWidth: isActive ? 1 : 0,
              borderColor: isActive ? theme.colors.inversePrimary : undefined,
            }}
          >
            <Card.Content>
              {/* <Icon name="priority-high" color={priorityColors[item.priority]} /> */}
              <Chip icon="clock-outline">
                {item.isEdited ? "Editada" : "Criada"} em:{" "}
                {formatTimeStamp(item.timeStamp)}
              </Chip>
              <View style={{ paddingVertical: 10 }}>
                {item.title && (
                  <Title style={{ fontWeight: "bold" }}>{item.title}</Title>
                )}

                <Paragraph>{item.text}</Paragraph>
              </View>

              {item.deliveryDay && (
                <Chip icon="calendar-clock" style={{ backgroundColor: color }}>
                  {status}
                  {item.deliveryDay} {item.deliveryTime && "às"}{" "}
                  {item.deliveryTime.slice(0, -3)}
                </Chip>
              )}
            </Card.Content>

            <Card.Actions style={{ overflow: "hidden" }}>
              {onDrag && (
                <Pressable onLongPress={onDrag}>
                  <IconButton icon="drag" mode="contained" />
                </Pressable>
              )}
              <IconButton icon="pencil" onPress={() => handleEdit(item.id)} />
              <IconButton
                icon="delete"
                onPress={() =>
                  handleDelete(
                    item.id,

                    item.notificationId?.notificationIdBeginOfDay ||
                      item.notificationId?.notificationIdExactTime
                      ? item.notificationId
                      : null
                  )
                }
              />

              <IconButton
                icon="check"
                onPress={() => {
                  checkActivity(
                    item.id,
                    item.notificationId ? item.notificationId : null
                  );
                }}
                iconColor={item.checked ? "green" : undefined}
                containerColor={item.checked ? "#34d399" : undefined}
              />
            </Card.Actions>
          </Card>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};
