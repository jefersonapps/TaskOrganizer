import AnimatedLottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Keyboard, PanResponderInstance, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "../../../theme/Theme";

interface SwipeComponentProps {
  panResponder: PanResponderInstance;
  isLottieViewVisible: boolean;
  style?: any;
}

export const SwipeComponent = ({
  panResponder,
  style,
  isLottieViewVisible,
}: SwipeComponentProps) => {
  const scale = useSharedValue(1);
  const bottom = useSharedValue(style.bottom || 0);

  const theme = useAppTheme();

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
        bottom.value = withDelay(500, withSpring(style.bottom));
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
      <View
        {...panResponder.panHandlers}
        style={{
          padding: 10,
          borderWidth: 2,
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.surfaceDisabled,
          width: 150,
          height: 50,
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLottieViewVisible && (
          <AnimatedLottieView
            autoPlay
            style={{
              width: 60,
              height: 60,
            }}
            source={require("../../../lottie-files/swipe.json")}
          />
        )}
      </View>
    </Animated.View>
  );
};
