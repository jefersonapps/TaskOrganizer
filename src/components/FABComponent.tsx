import React, { useEffect } from "react";
import { Keyboard, ViewStyle } from "react-native";
import { FAB } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FABComponentProps {
  action: () => void;
  icon: string;
  style: ViewStyle;
}

export const FABComponent = ({ action, style, icon }: FABComponentProps) => {
  const scale = useSharedValue(1);
  const bottom = useSharedValue(style.bottom || 0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scale.value = withTiming(0);
        bottom.value = withTiming(-200);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        scale.value = withDelay(500, withSpring(1));
        bottom.value = withDelay(500, withSpring(style.bottom as number));
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      bottom: bottom.value,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      <FAB icon={icon} onPress={action} />
    </Animated.View>
  );
};
