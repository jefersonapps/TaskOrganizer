import { useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Card, Chip, IconButton, Paragraph, Title } from "react-native-paper";
import {
  ActivityType,
  AppContext,
  NotificationIdType,
} from "../../../contexts/AppContext";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc"; // Importando o plugin utc
import * as Haptics from "expo-haptics";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { priorityColors } from "../../../constants/constants";
import {
  formatTimeStamp,
  getPriorityColor,
} from "../../../helpers/helperFunctions";
import { useAppTheme } from "../../../theme/Theme";
import { ActivityMultipleDelete } from "../ActivitiesScreen";
import { RootStackParamList } from "../ActivitiesStack";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
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
    const activity =
      activities.todos.find((a) => a.id === id) ||
      activities.checkedTodos.find((a) => a.id === id) ||
      activities.withDeadLine.find((a) => a.id === id) ||
      activities.withPriority.find((a) => a.id === id);

    if (activity) {
      navigation.navigate("EditActivity", { activity });
    }
  }, []);

  const theme = useAppTheme();

  const { status, color } = getPriorityColor({ item: item, theme: theme });

  const isSelected = useMemo(
    () => selectedActivities.some((activity) => activity.id === item.id),
    [selectedActivities]
  );

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
      <Animated.View style={styles.rowCentered} entering={SlideInLeft}>
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
        <View style={styles.cardContainer}>
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
              borderColor: isActive
                ? theme.colors.inversePrimary
                : idOfNotification === item.id
                ? theme.colors.tertiary
                : undefined,
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

                {item.text && <Paragraph>{item.text}</Paragraph>}
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
      </Animated.View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    alignItems: "stretch",
  },
});
