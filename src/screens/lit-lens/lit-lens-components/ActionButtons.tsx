import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import Animated, {
  RotateInDownLeft,
  ZoomInEasyUp,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ActionButtonsProps {
  onCopy: () => void;
  ocrResult: string;
  isCopied: boolean;
  onOpenCamera: () => void;
  pickImage: () => void;
  pickMultiplesImages: () => void;
}

const ICON_SIZE = 58;

export const ActionButtons = ({
  onCopy,
  ocrResult,
  isCopied,
  onOpenCamera,
  pickImage,
  pickMultiplesImages,
}: ActionButtonsProps) => {
  const bottom = useSharedValue(0);
  const height = useSharedValue(ICON_SIZE);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        bottom.value = withTiming(-60);
        setTimeout(() => {
          bottom.value = withTiming(0);
        }, 500);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: bottom.value,
    };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const openToggle = useCallback(() => {
    height.value = withSpring(ICON_SIZE * 4);
  }, []);

  const closeToggle = useCallback(() => {
    height.value = withSpring(ICON_SIZE);
  }, []);

  const handleToggle = useCallback(() => {
    setIsToggleOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isToggleOpen) {
      openToggle();
    } else {
      closeToggle();
    }
  }, [isToggleOpen]);

  return (
    <View>
      <Animated.View
        style={[
          animatedStyle,
          styles.container,
          {
            justifyContent: ocrResult ? "space-between" : "flex-end",
          },
        ]}
      >
        {ocrResult && (
          <IconButton
            mode="contained-tonal"
            iconColor={isCopied ? "#34d399" : undefined}
            onPress={onCopy}
            icon="content-copy"
            size={30}
          />
        )}
      </Animated.View>
      <Animated.View
        style={[
          animatedHeightStyle,
          animatedStyle,
          styles.pickButtonsContainer,
        ]}
      >
        {isToggleOpen && (
          <>
            <IconButton
              mode="contained"
              onPress={pickMultiplesImages}
              icon="image-multiple"
              size={30}
            />
            <IconButton
              mode="contained"
              onPress={pickImage}
              icon="image"
              size={30}
            />
            <IconButton
              mode="contained"
              onPress={onOpenCamera}
              icon="camera"
              size={30}
            />
          </>
        )}
        {isToggleOpen && (
          <Animated.View entering={RotateInDownLeft} exiting={ZoomOut}>
            <IconButton
              mode="contained"
              onPress={handleToggle}
              icon={"close"}
              size={30}
            />
          </Animated.View>
        )}
        {!isToggleOpen && (
          <Animated.View entering={ZoomInEasyUp} exiting={ZoomOut}>
            <IconButton
              mode="contained"
              onPress={handleToggle}
              icon={"paperclip"}
              size={30}
            />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  pickButtonsContainer: {
    right: 0,
    bottom: 0,
    position: "absolute",
    height: ICON_SIZE,
  },
});
