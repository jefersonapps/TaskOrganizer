import React, { useEffect, useMemo } from "react";
import { Pressable, TouchableNativeFeedback, View } from "react-native";
import { IconButton, Card as PaperCard, Text, Title } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { priorityColors } from "../../../constants/constants";
import { SheduleActivityType } from "../../../contexts/AppContext";
import { useAppTheme } from "../../../theme/Theme";
import { ScheduleMultipleDelete } from "../SheduleScreen";

interface SheduleCardProps {
  item: SheduleActivityType;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  swipeDirection: string;
  onLongPress: (id: string, day: string) => void;
  onPress: (id: string, day: string) => void;
  onDrag: () => void;
  isActive?: boolean;
  selectedSchedules: ScheduleMultipleDelete[];
  day: string;
}

export const SheduleCard = ({
  item,
  handleDelete,
  handleEdit,
  swipeDirection,
  onLongPress,
  isActive,
  onDrag,
  onPress,
  selectedSchedules,
  day,
}: SheduleCardProps) => {
  const theme = useAppTheme();
  const positionAnimation = useSharedValue(
    selectedSchedules.length > 0 ? 0 : swipeDirection === "right" ? -1000 : 1000
  );
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionAnimation.value }],
    };
  });

  useEffect(() => {
    if (selectedSchedules.length > 0) return;

    positionAnimation.value = withSpring(0, { damping: 16 });
  }, [positionAnimation, swipeDirection, selectedSchedules]);

  const isSelected = useMemo(
    () => selectedSchedules.some((activity) => activity.id === item.id),
    [selectedSchedules]
  );

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#807e7e15", false)}
      onPress={() => {
        onPress(item.id, day);
      }}
      onLongPress={() => onLongPress(item.id, day)}
      useForeground
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {selectedSchedules.length > 0 && (
          <IconButton
            icon={isSelected ? "check" : "circle-outline"}
            mode={isSelected ? "contained" : "outlined"}
            onPress={() => {
              onPress(item.id, day);
            }}
            style={{ marginLeft: 14 }}
          />
        )}
        <Animated.View
          style={[
            {
              margin: 10,
              flex: 1,
            },
            animatedStyle,
          ]}
        >
          <PaperCard
            style={{
              borderColor: isActive ? theme.colors.inversePrimary : undefined,
              borderWidth: isActive ? 1 : 0,
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
            <PaperCard.Content>
              {item.title && (
                <Title style={{ fontWeight: "bold" }}>{item.title}</Title>
              )}
              <Text style={{ fontSize: 16 }}>{item.text}</Text>
            </PaperCard.Content>
            <PaperCard.Actions>
              <Pressable onLongPress={onDrag}>
                <IconButton icon="drag" mode="contained" />
              </Pressable>

              <IconButton
                icon="pencil"
                onPress={() => handleEdit(item.id)}
                iconColor={theme.colors.primary}
              />
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item.id)}
                iconColor={theme.colors.error}
              />
            </PaperCard.Actions>
          </PaperCard>
        </Animated.View>
      </View>
    </TouchableNativeFeedback>
  );
};
