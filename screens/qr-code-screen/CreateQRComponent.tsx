import React, { useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SvgQRCode from "react-native-qrcode-svg";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  Paragraph,
  Portal,
  Switch,
  Text,
} from "react-native-paper";
import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { useAppTheme } from "../../theme/Theme";

import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { CustomAlert } from "../../components/CustomAlert";
import * as Sharing from "expo-sharing";
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  Swatches,
} from "reanimated-color-picker";
import {
  useMediaLibraryPermission,
  useSaveImagePermission,
} from "../../Hooks/usePermission";
import { GetPermission } from "../../components/GetPermission";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const PickColor = ({ showPickColor, setShowPickColor, setColor }: any) => {
  return (
    <Portal>
      <Dialog
        visible={!!showPickColor}
        onDismiss={() => setShowPickColor(false)}
      >
        <Dialog.Title>Escolha uma cor</Dialog.Title>
        <Dialog.Content>
          <View>
            <ColorPicker
              style={{ gap: 14 }}
              value="red"
              onComplete={({ hex }) => setColor(hex)}
            >
              <Panel1 style={{ height: 160 }} />
              <HueSlider style={{ height: 50 }} />
              <OpacitySlider style={{ height: 50 }} />
            </ColorPicker>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowPickColor(null)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

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
  const [logoUri, setLogoUri] = useState<string | null>(null);

  console.log(firstColor, secondColor);

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

  const pickImage = async () => {
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

  const { mediaLibraryPermission, requestMediaLibraryPermission } =
    useMediaLibraryPermission();
  const { saveImagePermission, requestSaveImagePermission } =
    useSaveImagePermission();

  if (mediaLibraryPermission === "denied") {
    return (
      <GetPermission
        getPermissionAfterSetInConfigs={requestMediaLibraryPermission}
        title="A galeria não está disponível"
        content="Desculpe, parece que não conseguimos acessar a galeria do seu dispositivo. 
      Por favor, verifique as configurações de permissão de acesso a fotos e vídeos 
      e tente novamente."
      />
    );
  }

  if (saveImagePermission === "denied") {
    return (
      <GetPermission
        getPermissionAfterSetInConfigs={requestSaveImagePermission}
        title="Permissão de acesso à biblioteca de mídia necessária"
        content="Precisamos de sua permissão para salvar imagens. Isso inclui acesso a fotos, 
        vídeos e áudios na biblioteca de mídia do seu dispositivo. 
        Por favor, permita o acesso nas configurações do seu dispositivo."
      />
    );
  }

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
          />
        </View>
      </View>
    </ScrollView>
  );
};
