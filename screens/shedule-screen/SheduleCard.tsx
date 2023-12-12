import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { IconButton, Card as PaperCard, Text, Title } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { SheduleActivityType } from "../../contexts/AppContext";
import { ScheduleMultipleDelete } from "./SheduleScreen";

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
  const positionAnim = useRef(
    new Animated.Value(
      selectedSchedules.length > 0
        ? 0
        : swipeDirection === "right"
        ? -1000
        : 1000
    )
  ).current;

  useEffect(() => {
    if (selectedSchedules.length > 0) return;
    Animated.timing(positionAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [positionAnim, swipeDirection, selectedSchedules]); // Adicione swipeDirection como dependência

  const isSelected = selectedSchedules.some(
    (activity) => activity.id === item.id
  );

  return (
    <Pressable
      onPress={() => {
        onPress(item.id, day);
      }}
      onLongPress={() => onLongPress(item.id, day)}
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
          style={{
            ...styles.container,
            transform: [{ translateX: positionAnim }],
          }}
        >
          <PaperCard
            style={{
              borderColor: isActive ? theme.colors.inversePrimary : undefined,
              borderWidth: isActive ? 1 : 0,
            }}
          >
            <PaperCard.Content>
              {item.title && <Title style={styles.bold}>{item.title}</Title>}
              <Text style={styles.cardText}>{item.text}</Text>
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  cardText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
});
