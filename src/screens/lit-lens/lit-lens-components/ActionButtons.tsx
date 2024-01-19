import React, { useEffect } from "react";
import { Keyboard, View } from "react-native";
import { Button } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "../../../theme/Theme";

interface ActionButtonsProps {
  onCopy: () => void;
  ocrResult: string;
  isCopied: boolean;
  onOpenCamera: () => void;
}

export const ActionButtons = ({
  onCopy,
  ocrResult,
  isCopied,
  onOpenCamera,
}: ActionButtonsProps) => {
  const theme = useAppTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        opacity.value = withTiming(0);
        setTimeout(() => {
          opacity.value = withTiming(1);
        }, 500);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          justifyContent: !ocrResult ? "flex-end" : "space-between",
          flexDirection: "row",
        }}
      >
        {ocrResult && (
          <Button
            mode="outlined"
            buttonColor={isCopied ? "#34d399" : undefined}
            textColor={isCopied ? theme.colors.inverseOnSurface : undefined}
            onPress={onCopy}
          >
            {isCopied ? "Copiado!" : "Copiar texto"}
          </Button>
        )}
        <Button mode="contained" onPress={onOpenCamera}>
          Abrir câmera
        </Button>
      </View>
    </Animated.View>
  );
};
