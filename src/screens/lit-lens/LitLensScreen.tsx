import * as Clipboard from "expo-clipboard";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useAppTheme } from "../../theme/Theme";

import LottieView from "lottie-react-native";

import { GetPermission } from "../../components/GetPermission";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppContext } from "../../contexts/AppContext";
import { ActionButtons } from "./lit-lens-components/ActionButtons";

type RootStackParamList = {
  LitLensScreen: undefined;
  CameraScreen: undefined;
};

type ConfigScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LitLensScreen"
>;

type NavigationProps = {
  navigation: ConfigScreenNavigationProp;
};
const { height } = Dimensions.get("window");

export const LitLensScreen = ({ navigation }: NavigationProps) => {
  const theme = useAppTheme();

  const [isCopied, setIsCopied] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const { ocrResult, setOcrResult } = useContext(AppContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!ocrResult.trim()}
          icon="broom"
          onPress={() => setOcrResult("")}
          style={{ marginRight: -8 }}
        ></IconButton>
      ),
    });
  }, [navigation, ocrResult]);

  const [cameraPermission, setCameraPermission] = useState<string | null>(
    "granted"
  );

  useEffect(() => {
    const checkCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      setCameraPermission(status);
    };

    checkCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    setCameraPermission(newCameraPermission);
  };

  useEffect(() => {
    if (!cameraPermission) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [cameraPermission]);

  const copyToClipboard = async (text: string) => {
    setIsCopied(true);
    await Clipboard.setStringAsync(text);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  if (cameraPermission === "denied" || !cameraPermission) {
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

  if (!device) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      ></View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {ocrResult ? (
          <TextInput
            theme={{ roundness: 20 }}
            contentStyle={{ marginHorizontal: 0 }}
            multiline
            style={styles.textInput}
            mode="outlined"
            label={"Texto identificado"}
            value={ocrResult}
            onChangeText={(text) => setOcrResult(text)}
          />
        ) : (
          <View style={styles.centeredView}>
            <Text style={styles.centeredText}>
              Bem-vindo ao LitLens! Abra a câmera, tire uma foto e tentaremos
              identificar o texto para você. Clique em{" "}
              <Text
                onPress={() => navigation.navigate("CameraScreen")}
                style={[styles.boldText, { color: theme.colors.primary }]}
              >
                Abrir câmera
              </Text>
              {"  "}
              para começar.
            </Text>
            <LottieView
              ref={lottieRef}
              source={require("../../lottie-files/scan-doc.json")}
              style={{ width: 300 }}
              autoPlay
              loop
            />
          </View>
        )}

        <ActionButtons
          onCopy={() => copyToClipboard(ocrResult)}
          onOpenCamera={() => navigation.navigate("CameraScreen")}
          isCopied={isCopied}
          ocrResult={ocrResult}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 14,
    gap: 14,
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    maxHeight: height * 0.4,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredText: {
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
});
