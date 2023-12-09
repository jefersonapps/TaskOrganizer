import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppTheme } from "../theme/Theme";
import { Text } from "react-native-paper";

interface ProgressBarProps {
  progressPercentage: number;
}

export const ProgressBar = ({ progressPercentage }: ProgressBarProps) => {
  const animation = useRef(new Animated.Value(0));

  const { width } = Dimensions.get("window");

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  const animatedWidth = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const theme = useAppTheme();
  const barColor =
    progressPercentage == 100 ? "#34d399" : theme.colors.inversePrimary;

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ marginRight: 8 }}>
        <FontAwesome5 name="check-circle" size={23} color="#22c55e" />
      </View>

      <View
        style={{
          flexDirection: "row",
          flex: 1,
          height: 15,

          backgroundColor: theme.colors.secondary,
          borderRadius: 99,
        }}
      >
        <Animated.View
          style={{
            width: animatedWidth,
            backgroundColor: barColor,
            borderRadius: 99,
          }}
        />
      </View>
      <Text style={{ fontWeight: "bold", paddingLeft: 8 }}>
        {progressPercentage.toFixed(0)}%
      </Text>
    </View>
  );
};
