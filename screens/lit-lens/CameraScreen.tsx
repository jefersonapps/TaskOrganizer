import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useCameraPermission } from "../../Hooks/usePermission";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { GetPermission } from "../../components/GetPermission";
import {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AppContext } from "../../contexts/AppContext";
import { scanOCR } from "vision-camera-ocr";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useAppTheme } from "../../theme/Theme";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

export const CameraScreen = () => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const theme = useAppTheme();

  const { cameraPermission, requestCameraPermission } = useCameraPermission();
  const { setImageSource, imageSource, setOcrResult } = useContext(AppContext);
  const [showCamera, setShowCamera] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const device = cameraPosition === "front" ? devices.front : devices.back;
  const [isflashOn, setIsFlashOn] = useState<"off" | "on">("off");
  const [isFlashAlerVisible, setIsFlashAlertVisible] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setShowCamera(false);
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
        runOnJS(setOcrResult)(data.result.text);
        runOnJS(setImageSource)(null);
      }
    },
    [imageSource]
  );

  const [zoom, setZoom] = useState(0);

  const pinchHandler = (e: PinchGestureHandlerGestureEvent) => {
    if (e.nativeEvent.scale !== undefined) {
      setFocusPoint(null);
      setZoom(e.nativeEvent.scale);
    }
  };

  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const isFocusing = useRef(false);

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

  const toggleCamera = () => {
    setCameraPosition((prevState) => (prevState === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    if (device === devices.back) {
      setIsFlashOn((prevFlash) => (prevFlash === "off" ? "on" : "off"));
    } else {
      setIsFlashAlertVisible(true);
    }
  };

  if (cameraPermission === "denied" || !device) {
    return (
      <GetPermission
        getPermissionAfterSetInConfigs={requestCameraPermission}
        title="A câmera não está disponível"
        content="Desculpe, parece que não conseguimos acessar a câmera do seu
      dispositivo. Por favor, verifique as configurações de permissão da
      câmera e tente novamente."
      />
    );
  }
  return (
    <TapGestureHandler onHandlerStateChange={handleTap}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <View style={{ flex: 1, position: "relative" }}>
          <View
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 1,
              gap: 8,
            }}
          >
            <Portal>
              <Dialog
                visible={!!isFlashAlerVisible}
                onDismiss={() => setIsFlashAlertVisible(false)}
              >
                <Dialog.Title>Flash Indisponível</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>
                    Desculpe, a funcionalidade de flash não está disponível para
                    a câmera frontal do dispositivo.
                  </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setIsFlashAlertVisible(false)}>
                    Ok
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

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
              style={{
                position: "absolute",
                left: focusPoint.x - 25,
                top: focusPoint.y - 25,
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: "white",
              }}
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
});
