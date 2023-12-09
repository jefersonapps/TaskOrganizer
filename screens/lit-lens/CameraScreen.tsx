import { useContext, useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useCameraPermission } from "../../Hooks/usePermission";
import { GetPermission } from "../../components/GetPermission";
import { runOnJS } from "react-native-reanimated";
import { AppContext } from "../../contexts/AppContext";
import { scanOCR } from "vision-camera-ocr";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export const CameraScreen = () => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const { cameraPermission, requestCameraPermission } = useCameraPermission();
  const { setImageSource, imageSource, setOcrResult } = useContext(AppContext);
  const [showCamera, setShowCamera] = useState(true);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setShowCamera(false);
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
    <>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={showCamera}
        photo={true}
        frameProcessor={frameProcessor}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.camButton}
          onPress={() => capturePhoto()}
        ></TouchableOpacity>
      </View>
    </>
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
