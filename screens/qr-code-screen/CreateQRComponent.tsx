import React, { SetStateAction, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SvgQRCode from "react-native-qrcode-svg";
import { Button, Text } from "react-native-paper";
import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { useAppTheme } from "../../theme/Theme";
import LottieView from "lottie-react-native";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { CustomAlert } from "../../components/CustomAlert";
import * as Sharing from "expo-sharing";

export const CreateQRComponent = () => {
  const theme = useAppTheme();

  const [isImageSaved, setIsImageSaved] = useState(false);
  const [inputText, setInputText] = useState("");
  const viewShotRef = useRef(null);

  const shareFile = (uri: string) => {
    Sharing.shareAsync(uri);
  };

  const handleShareQRCode = async () => {
    try {
      const localUri = await captureRef(viewShotRef, {
        height: 440,
        quality: 1,
      });
      if (localUri) {
        shareFile(localUri);
      }
    } catch (error) {
      console.error(
        "An error occurred while downloading and saving QR Code",
        error
      );
    }
  };

  const saveImage = async (uri: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(uri);
        setIsImageSaved(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadQRCode = async () => {
    if (!viewShotRef.current) return;
    try {
      const localUri = await captureRef(viewShotRef, {
        height: 440,
        quality: 1,
      });
      if (localUri) {
        saveImage(localUri);
      }
    } catch (error) {
      console.error(
        "An error occurred while downloading and saving QR Code",
        error
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <CustomAlert
        title="Sucesso!"
        content="Imagem salva na galeria"
        isVisible={isImageSaved}
        setIsVisible={setIsImageSaved}
      />
      <View style={{ flex: 1, alignItems: "center", paddingVertical: 14 }}>
        <View
          style={{ padding: 10, backgroundColor: "white", borderRadius: 10 }}
          ref={viewShotRef}
        >
          <SvgQRCode value={inputText || "Digite algo..."} size={160} />
        </View>
        <View style={{ flexDirection: "row", paddingTop: 14, gap: 14 }}>
          <Button
            mode="contained"
            onPress={handleDownloadQRCode}
            style={{
              backgroundColor: theme.colors.primaryContainer,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="download"
              size={20}
              color={theme.colors.onPrimaryContainer}
            />
            <Text style={{ color: theme.colors.onPrimaryContainer }}>
              {" "}
              &nbsp;Baixar
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={handleShareQRCode}
            style={{
              backgroundColor: theme.colors.primaryContainer,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="sharealt"
              size={20}
              color={theme.colors.onPrimaryContainer}
            />
            <Text
              style={{
                color: theme.colors.onPrimaryContainer,
                marginLeft: 2,
              }}
            >
              {" "}
              &nbsp;Enviar
            </Text>
          </Button>
        </View>
        <View style={{ margin: 15 }}>
          <View style={{ marginTop: "auto", width: "100%" }}>
            <TextInputComponent
              label="Digite um link ou texto..."
              setText={setInputText}
              text={inputText}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
