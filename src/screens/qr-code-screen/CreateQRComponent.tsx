import { AntDesign } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  List,
  Switch,
  Text,
} from "react-native-paper";
import SvgQRCode from "react-native-qrcode-svg";
import { useAppTheme } from "../../theme/Theme";

import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AlertComponent } from "../../components/AlertComponent";
import { TextInputComponent } from "../../components/TextInputComponent";
import { PickColor } from "./qr-code-components/PickColor";

export const CreateQRComponent = () => {
  const theme = useAppTheme();

  const [isImageSaved, setIsImageSaved] = useState(false);
  const [inputText, setInputText] = useState("");
  const viewShotRef = useRef(null);

  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [enableLinearGradient, setEnableLinearGradient] = useState(false);

  const [firstColor, setFirstColor] = useState("#000000");
  const [secondColor, setSecondColor] = useState("#000000");

  const [showPickColor, setShowPickColor] = useState(false);
  const [showSecondPickColor, setShowSecondPickColor] = useState(false);
  const [showPrimaryPickColor, setShowPrimaryColorPickColor] = useState(false);
  const [showBackgroundPickColor, setShowBackgroundColorPickColor] =
    useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [imagePickerStatus, requestImagePickerPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaLibraryResponse, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

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
      if (mediaLibraryResponse?.granted) {
        await MediaLibrary.saveToLibraryAsync(uri);

        setIsImageSaved(true);
      } else {
        requestMediaLibraryPermission();
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

  const pickImage = async () => {
    if (!imagePickerStatus?.granted) {
      requestImagePickerPermission();
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AlertComponent
        title="Sucesso!"
        content="Imagem salva na galeria"
        visible={isImageSaved}
        confirmText="Entendi"
        onConfirm={() => setIsImageSaved(false)}
      />
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: backgroundColor,
            padding: 14,
            borderRadius: 10,
          }}
          ref={viewShotRef}
        >
          <SvgQRCode
            value={inputText || "Digite algo..."}
            size={160}
            color={color}
            backgroundColor={backgroundColor}
            logoSize={30}
            logo={{ uri: logoUri ? logoUri : undefined }}
            enableLinearGradient={enableLinearGradient}
            linearGradient={[firstColor, secondColor]}
          />
        </View>
        <View style={styles.buttons}>
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

        <View
          style={{ marginTop: "auto", width: "100%", paddingHorizontal: 15 }}
        >
          <TextInputComponent
            label="Digite um link ou texto..."
            setText={setInputText}
            text={inputText}
          />
        </View>

        <View style={{ width: "100%" }}>
          <List.Item
            title="Selecione uma imagem"
            left={() => (
              <List.Icon
                style={{ paddingLeft: 10 }}
                icon={() => (
                  <IconButton mode="contained" icon="image"></IconButton>
                )}
              />
            )}
            right={() => (
              <IconButton
                mode="contained"
                disabled={!logoUri}
                icon="broom"
                onPress={() => setLogoUri(null)}
              ></IconButton>
            )}
            onPress={pickImage}
          />

          <Divider style={{ width: "100%" }} />

          <List.Item
            title="Cor principal"
            style={{ paddingLeft: 10 }}
            left={() => (
              <List.Icon
                icon={() => (
                  <View style={{ padding: 6 }}>
                    <Ionicons
                      name="color-palette"
                      size={24}
                      color={theme.colors.primary}
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                        padding: 8,
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                )}
              />
            )}
            right={() => (
              <IconButton
                mode="contained"
                disabled={color === "black" || color === "#000000"}
                icon="broom"
                onPress={() => setColor("black")}
              ></IconButton>
            )}
            onPress={() => setShowPrimaryColorPickColor(true)}
          />

          <PickColor
            showPickColor={showPrimaryPickColor}
            setShowPickColor={setShowPrimaryColorPickColor}
            setColor={setColor}
            color={color}
          />

          <Divider style={{ width: "100%" }} />

          <List.Item
            title="Cor de fundo"
            style={{ paddingLeft: 10 }}
            left={() => (
              <List.Icon
                icon={() => (
                  <View style={{ padding: 6 }}>
                    <Ionicons
                      name="color-palette"
                      size={24}
                      color={theme.colors.primary}
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                        padding: 8,
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                )}
              />
            )}
            right={() => (
              <IconButton
                mode="contained"
                disabled={
                  backgroundColor === "white" || backgroundColor === "#ffffff"
                }
                icon="broom"
                onPress={() => setBackgroundColor("white")}
              ></IconButton>
            )}
            onPress={() => setShowBackgroundColorPickColor(true)}
          />

          <PickColor
            showPickColor={showBackgroundPickColor}
            setShowPickColor={setShowBackgroundColorPickColor}
            setColor={setBackgroundColor}
            color={backgroundColor}
          />
          <Divider style={{ width: "100%" }} />

          <List.Item
            title="Ativar gradiente linear"
            style={{ paddingLeft: 10 }}
            left={() => (
              <List.Icon
                icon={() => (
                  <View style={{ padding: 6 }}>
                    <MaterialCommunityIcons
                      name="gradient-horizontal"
                      size={24}
                      color={theme.colors.primary}
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                        padding: 8,
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                )}
              />
            )}
            right={() => (
              <Switch
                value={enableLinearGradient}
                onValueChange={setEnableLinearGradient}
              />
            )}
            onPress={() => setEnableLinearGradient((prev) => !prev)}
          />

          <List.Item
            disabled={!enableLinearGradient}
            title="Primeira cor do gradiente"
            style={{ paddingLeft: 10 }}
            titleStyle={{
              color: !enableLinearGradient
                ? "gray"
                : theme.colors.inverseSurface,
            }}
            left={() => (
              <List.Icon
                icon={() => (
                  <View style={{ padding: 6 }}>
                    <Ionicons
                      name="color-palette"
                      size={24}
                      color={
                        !enableLinearGradient
                          ? theme.colors.onSurfaceDisabled
                          : theme.colors.primary
                      }
                      style={{
                        backgroundColor: !enableLinearGradient
                          ? theme.colors.surfaceDisabled
                          : theme.colors.secondaryContainer,
                        padding: 8,
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                )}
              />
            )}
            right={() => (
              <IconButton
                mode="contained"
                disabled={firstColor === "black" || firstColor === "#000000"}
                icon="broom"
                onPress={() => setFirstColor("black")}
              ></IconButton>
            )}
            onPress={() => setShowPickColor(true)}
          />

          <PickColor
            showPickColor={showPickColor}
            setShowPickColor={setShowPickColor}
            setColor={setFirstColor}
            color={firstColor}
          />

          <List.Item
            disabled={!enableLinearGradient}
            title="Segunda cor do gradiente"
            titleStyle={{
              color: !enableLinearGradient
                ? "gray"
                : theme.colors.inverseSurface,
            }}
            style={{ paddingLeft: 10 }}
            left={() => (
              <List.Icon
                icon={() => (
                  <View style={{ padding: 6 }}>
                    <Ionicons
                      name="color-palette"
                      size={24}
                      color={
                        !enableLinearGradient
                          ? theme.colors.onSurfaceDisabled
                          : theme.colors.primary
                      }
                      style={{
                        backgroundColor: !enableLinearGradient
                          ? theme.colors.surfaceDisabled
                          : theme.colors.secondaryContainer,
                        padding: 8,
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                )}
              />
            )}
            right={() => (
              <IconButton
                mode="contained"
                disabled={secondColor === "black" || secondColor === "#000000"}
                icon="broom"
                onPress={() => setSecondColor("black")}
              ></IconButton>
            )}
            onPress={() => setShowSecondPickColor(true)}
          />

          <PickColor
            showPickColor={showSecondPickColor}
            setShowPickColor={setShowSecondPickColor}
            setColor={setSecondColor}
            color={secondColor}
          />

          <List.Item
            title="Cuidado com as cores escolhidas. "
            titleStyle={{
              color: theme.colors.inverseSurface,
            }}
            style={{ paddingLeft: 10 }}
            left={() => (
              <List.Icon
                icon={() => (
                  <View style={{ padding: 6 }}>
                    <Ionicons
                      name="alert-circle"
                      size={24}
                      color={theme.colors.primary}
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                        padding: 8,
                        borderRadius: 9999,
                      }}
                    />
                  </View>
                )}
              />
            )}
          />
          <Text
            style={{
              paddingHorizontal: 14,
              textAlign: "justify",
              fontWeight: "bold",
              fontStyle: "italic",
              color: theme.colors.onSurface,
            }}
          >
            O uso de cores muito similares pode dificultar a leitura do código
            QR. Após a geração do código, recomendamos que você faça o download
            e realize um teste utilizando a opção{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
              &nbsp;Ler QR&nbsp;
            </Text>{" "}
            disponível acima.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingVertical: 14 },
  buttons: { flexDirection: "row", paddingTop: 14, gap: 14 },
});
