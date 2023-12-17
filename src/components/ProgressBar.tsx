import React, { useEffect } from "react";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppTheme } from "../theme/Theme";
import { Text } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";

interface ProgressBarProps {
  progressPercentage: number;
}

export const ProgressBar = ({ progressPercentage }: ProgressBarProps) => {
  const animation = useSharedValue(0);

  const config: SpringConfig = {
    duration: 1000,
    dampingRatio: 0.6,
  };

  useEffect(() => {
    animation.value = withDelay(1000, withSpring(progressPercentage, config));
  }, [progressPercentage]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animation.value}%`,
    };
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
          style={[
            animatedStyle,
            {
              backgroundColor: barColor,
              borderRadius: 99,
            },
          ]}
        />
      </View>
      <Text style={{ fontWeight: "bold", paddingLeft: 8 }}>
        {progressPercentage.toFixed(0)}%
      </Text>
    </View>
  );
};
