import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  CameraPermissionRequestResult,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import { scanOCR } from "vision-camera-ocr";
import {
  Button,
  IconButton,
  TextInput,
  Text,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import * as Linking from "expo-linking";
import { useFocusEffect } from "@react-navigation/native";
import { GetPermission } from "../../components/GetPermission";

export const LitLensScreen = () => {
  const camera = useRef<Camera>(null);
  const theme = useAppTheme();
  const navigation = useNavigation();

  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>("");
  const [ocrResult, setOcrResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const copyToClipboard = async (text: string) => {
    setIsCopied(true);
    await Clipboard.setStringAsync(text);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const devices = useCameraDevices();
  const device = devices.back;

  const [permission, setPermission] = useState<CameraPermissionRequestResult>();

  useFocusEffect(
    useCallback(() => {
      async function getPermission() {
        const status = await Camera.requestCameraPermission();
        setPermission(status);
      }
      getPermission();
    }, [permission])
  );

  useEffect(() => {
    async function getPermission() {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
    }
    getPermission();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!ocrResult.trim()}
          icon="broom"
          onPress={() => setOcrResult("")}
        ></IconButton>
      ),
    });
  }, [navigation, ocrResult]);

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

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      setImageSource(photo.path);
      setShowCamera(false);
    }
  };

  if (device == null || permission === "denied" || permission === undefined) {
    async function getPermissionAfterSetInConfigs() {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
    }
    return (
      <GetPermission
        getPermissionAfterSetInConfigs={getPermissionAfterSetInConfigs}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {showCamera ? (
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
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: theme.colors.background,
            padding: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 14,
              gap: 10,
              alignItems: "center",
              width: "100%",
              flex: 1,
            }}
          >
            {ocrResult ? (
              <TextInput
                theme={{ roundness: 20 }}
                contentStyle={{
                  marginHorizontal: 0,
                }}
                multiline
                style={{ flex: 1 }}
                mode="outlined"
                label={"Texto identificado"}
                value={ocrResult}
                onChangeText={(text) => setOcrResult(text)}
              />
            ) : (
              <View style={{ alignItems: "center", width: "100%" }}>
                <Text style={{ textAlign: "center" }}>
                  Bem-vindo ao LitLens! Abra a câmera, tire uma foto e
                  tentaremos identificar o texto para você. Clique em{" "}
                  <Text
                    style={{ fontWeight: "bold", color: theme.colors.primary }}
                  >
                    Abrir&nbsp;câmera
                  </Text>{" "}
                  para começar.
                </Text>

                <LottieView
                  source={require("../../lottie-files/scan-doc.json")}
                  style={{ width: 300 }}
                  autoPlay
                  loop
                />
              </View>
            )}
          </View>

          <View style={styles.buttons}>
            <Button
              mode="outlined"
              buttonColor={isCopied ? "#34d399" : undefined}
              textColor={isCopied ? theme.colors.inverseOnSurface : undefined}
              onPress={() => copyToClipboard(ocrResult)}
            >
              {isCopied ? "Copiado!" : "Copiar texto"}
            </Button>
            <Button mode="contained" onPress={() => setShowCamera(true)}>
              Abrir câmera
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    padding: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
