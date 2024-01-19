import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { daysOfWeek } from "../../../constants/constants";
import { useAppTheme } from "../../../theme/Theme";

interface TopTabsProps {
  setActiveTab: (activeTab: number) => void;
  activeTab: number;
}

export const TopBarComponent = ({ setActiveTab, activeTab }: TopTabsProps) => {
  const translateX = useRef(new Animated.Value(10)).current;
  const theme = useAppTheme();

  const ITEM_WIDTH = 59;

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(translateX, {
      toValue: index * ITEM_WIDTH + 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    handleTabPress(activeTab);
  }, [activeTab]);

  const indicatorStyle = {
    transform: [{ translateX }],
    width: 40,
  };

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{ height: 35, marginBottom: 8 }}
      >
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            activeOpacity={0.6}
            key={index}
            onPress={() => handleTabPress(index)}
            style={{ padding: 5, width: ITEM_WIDTH }}
          >
            <Text
              style={[
                index === activeTab ? styles.activeText : styles.inactiveText,
                {
                  color:
                    index === activeTab
                      ? theme.colors.primary
                      : theme.colors.secondary,
                },
              ]}
            >
              {day !== "Sab" ? day : "Sáb"}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: theme.colors.primary },
          ]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  inactiveText: {
    fontWeight: "normal",
    textAlign: "center",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
  },
});
