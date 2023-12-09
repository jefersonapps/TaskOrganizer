import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { IconButton, Card as PaperCard, Text, Title } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { SheduleActivityType } from "../../contexts/AppContext";

interface SheduleCardProps {
  item: SheduleActivityType;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  swipeDirection: string;
  onLongPress: () => void;
  isActive?: boolean;
}

export const SheduleCard = ({
  item,
  handleDelete,
  handleEdit,
  swipeDirection,
  onLongPress,
  isActive,
}: SheduleCardProps) => {
  const theme = useAppTheme();
  const positionAnim = useRef(
    new Animated.Value(swipeDirection === "right" ? -1000 : 1000)
  ).current;

  useEffect(() => {
    Animated.timing(positionAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [positionAnim, swipeDirection]); // Adicione swipeDirection como dependência

  return (
    <Animated.View
      style={{ ...styles.container, transform: [{ translateX: positionAnim }] }}
    >
      <PaperCard
        onLongPress={onLongPress}
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
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  cardText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
});
