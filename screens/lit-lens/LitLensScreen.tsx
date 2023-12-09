import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { Button, IconButton, TextInput, Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";

import LottieView from "lottie-react-native";

import { GetPermission } from "../../components/GetPermission";
import { useCameraPermission } from "../../Hooks/usePermission";

import { AppContext } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

export const LitLensScreen = ({ navigation }: NavigationProps) => {
  const theme = useAppTheme();

  const [isCopied, setIsCopied] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const { cameraPermission, requestCameraPermission } = useCameraPermission();
  const { ocrResult, setOcrResult, imageSource, setImageSource } =
    useContext(AppContext);

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
            <Text style={[styles.boldText, { color: theme.colors.primary }]}>
              Abrir câmera
            </Text>{" "}
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

      <View
        style={[
          styles.buttons,
          { justifyContent: !ocrResult ? "flex-end" : "space-between" },
        ]}
      >
        {ocrResult && (
          <Button
            mode="outlined"
            buttonColor={isCopied ? "#34d399" : undefined}
            textColor={isCopied ? theme.colors.inverseOnSurface : undefined}
            onPress={() => copyToClipboard(ocrResult)}
          >
            {isCopied ? "Copiado!" : "Copiar texto"}
          </Button>
        )}

        <Button
          mode="contained"
          onPress={() => navigation.navigate("CameraScreen")}
        >
          Abrir câmera
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 14,
    gap: 14,
  },
  textInput: {
    flex: 1,
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
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
