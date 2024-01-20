import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useAppTheme } from "../../theme/Theme";

import LottieView from "lottie-react-native";

import { GetPermission } from "../../components/GetPermission";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import MlkitOcr from "react-native-mlkit-ocr";
import { showToast } from "../../helpers/helperFunctions";
import { useLitLens } from "./context/LitLensContext";
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

  const { ocrResult, setOcrResult } = useLitLens();

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

  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (
        result &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        const uri = result.assets[0].uri;

        try {
          setIsLoading(true);

          const results = await MlkitOcr.detectFromUri(result.assets[0].uri);
          let ocrResultString = "";
          results.forEach((block) => {
            block.lines.forEach((line) => {
              ocrResultString += line.text + "\n";
            });
          });
          setOcrResult(
            ocrResultString
              ? ocrResultString
              : "Nenhum texto identificado, tente novamente..."
          );
        } catch (error) {
          console.debug(error);
          showToast("Erro ao escanear, feche o app e tente novamente...");
        }
      }
    } catch (error) {
      console.debug(error);
      showToast("Erro ao abrir a galeria, feche o app e tente novamente...");
    } finally {
      setIsLoading(false);
    }
  };

  const pickMultiplesImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (result && result.assets && result.assets.length > 0) {
        const selectedImages = result.assets;

        try {
          setIsLoading(true);

          let accumulatedOcrResultString = "";

          // Loop através de cada imagem selecionada
          for (const image of selectedImages) {
            const uri = image.uri;

            const results = await MlkitOcr.detectFromUri(uri);

            results.forEach((block) => {
              block.lines.forEach((line) => {
                accumulatedOcrResultString += line.text + "\n";
              });
            });
          }

          setOcrResult(
            accumulatedOcrResultString
              ? accumulatedOcrResultString
              : "Nenhum texto identificado, tente novamente..."
          );
        } catch (error) {
          console.debug(error);
          showToast("Erro ao escanear, feche o app e tente novamente...");
        }
      }
    } catch (error) {
      console.debug(error);
      showToast("Erro ao abrir a galeria, feche o app e tente novamente...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      setCameraPermission(status);
    };
    requestCameraPermission();
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
  }, [cameraPermission, isLoading]);

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
        {ocrResult && !isLoading ? (
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
                onPress={() => {
                  navigation.navigate("CameraScreen");
                  setOcrResult("");
                }}
                style={[styles.boldText, { color: theme.colors.primary }]}
              >
                Abrir câmera
              </Text>
              {"  "}
              para começar.
            </Text>
            <LottieView
              key={isLoading.toString()}
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
          onOpenCamera={() => {
            navigation.navigate("CameraScreen");
            setOcrResult("");
          }}
          pickImage={pickImage}
          pickMultiplesImages={pickMultiplesImages}
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
    position: "relative",
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
