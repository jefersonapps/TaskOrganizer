import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { scanOCR } from "vision-camera-ocr";
import { AlertComponent } from "../../components/AlertComponent";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";

export const CameraScreen = () => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const theme = useAppTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const isFocusing = useRef(false);

  const { setImageSource, imageSource, setOcrResult } = useContext(AppContext);
  const [showCamera, setShowCamera] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");
  const [isflashOn, setIsFlashOn] = useState<"off" | "on">("off");
  const [isFlashAlerVisible, setIsFlashAlertVisible] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const device = cameraPosition === "front" ? devices.front : devices.back;

  useEffect(() => {
    if (!isFocused) {
      setShowCamera(false);
      navigation.goBack();
    } else {
      setShowCamera(true);
    }
  }, [isFocused]);

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      setImageSource(photo.path);

      navigation.goBack();
    }
  };

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (imageSource) {
        const data = scanOCR(frame);
        const text = data.result.text
          ? data.result.text
          : "Nenhum texto identificado, tente novamente...";
        runOnJS(setOcrResult)(text);
        runOnJS(setImageSource)(null);
      }
    },
    [imageSource]
  );

  const pinchHandler = useCallback((e: PinchGestureHandlerGestureEvent) => {
    if (e.nativeEvent.scale !== undefined) {
      setFocusPoint(null);
      setZoom(e.nativeEvent.scale);
    }
  }, []);

  const handleTap = async (event: TapGestureHandlerGestureEvent) => {
    if (camera.current && !isFocusing.current) {
      isFocusing.current = true;
      setFocusPoint({ x: event.nativeEvent.x, y: event.nativeEvent.y });
      try {
        if (event.nativeEvent.x > 330 && event.nativeEvent.y < 130) return;
        if (event.nativeEvent.y > 630) return;
        await camera.current.focus({
          x: event.nativeEvent.x,
          y: event.nativeEvent.y,
        });
      } catch (error) {
        console.log(error);
      } finally {
        isFocusing.current = false;
        setFocusPoint(null);
      }
    }
  };

  const toggleCamera = useCallback(() => {
    setCameraPosition((prevState) => (prevState === "back" ? "front" : "back"));
  }, []);

  const toggleFlash = useCallback(() => {
    if (device === devices.back) {
      setIsFlashOn((prevFlash) => (prevFlash === "off" ? "on" : "off"));
    } else {
      setIsFlashAlertVisible(true);
    }
  }, []);

  if (!device) {
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.colors.customBackground }}
      ></View>
    );
  }
  return (
    <TapGestureHandler onHandlerStateChange={handleTap}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <View style={{ flex: 1, position: "relative" }}>
          <View style={styles.container}>
            <AlertComponent
              content="Desculpe, a funcionalidade de flash não está disponível para
            a câmera frontal do dispositivo."
              title="Flash Indisponível"
              visible={!!isFlashAlerVisible}
              confirmText="Entendi"
              onConfirm={() => setIsFlashAlertVisible(false)}
            />

            <TouchableOpacity onPress={toggleFlash} activeOpacity={0.6}>
              <View
                style={{
                  padding: 14,
                  borderRadius: 9999,
                  backgroundColor: theme.colors.inversePrimary,
                }}
              >
                <MaterialIcons
                  name={isflashOn === "on" ? "flash-on" : "flash-off"}
                  size={24}
                  color={theme.colors.onSurface}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCamera} activeOpacity={0.6}>
              <View
                style={{
                  padding: 14,
                  borderRadius: 9999,
                  backgroundColor: theme.colors.inversePrimary,
                }}
              >
                <Ionicons
                  name="ios-camera-reverse-sharp"
                  size={24}
                  color={theme.colors.onSurface}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Camera
            ref={camera}
            torch={isflashOn}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo={true}
            frameProcessor={frameProcessor}
            zoom={zoom}
          />

          {focusPoint && (
            <View
              style={[
                styles.focusPoint,
                {
                  left: focusPoint.x - 25,
                  top: focusPoint.y - 25,
                },
              ]}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.camButton}
              onPress={() => capturePhoto()}
            ></TouchableOpacity>
          </View>
        </View>
      </PinchGestureHandler>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
    gap: 8,
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    padding: 20,
  },

  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#B2BEB5",
    alignSelf: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  focusPoint: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
  },
});
