import React, { useContext, useEffect, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAppTheme } from "../../theme/Theme";
import { CopyTextComponent } from "./CopyTextComponent";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { handleVisitSite, isValidURL } from "../../helpers/helperFunctions";
import { GetPermission } from "../../components/GetPermission";
import { AppContext } from "../../contexts/AppContext";
import { useMediaLibraryPermission } from "../../Hooks/usePermission";

export const ReadQRTab = () => {
  const theme = useAppTheme();
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleReadImageScanned = ({ data }: { data: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isValidURL(data)) {
      setLink(String(data));
      setCode("");
    } else {
      setLink("");
      setCode(String(data));
    }
  };

  const DecodeImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          quality: 1,
        });
        if (result && result.assets && result.assets[0].uri) {
          setSelectedImage(result.assets[0].uri);
          try {
            const results = await BarCodeScanner.scanFromURLAsync(
              result.assets[0].uri
            );
            if (results.length > 0) {
              handleReadImageScanned(results[0]);
            } else {
              handleReadImageScanned({ data: "Nenhum código encontrado!" });
            }
          } catch (error) {
            console.debug(error);
            handleReadImageScanned({ data: "Nenhum código encontrado!" });
          }
        }
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const { mediaLibraryPermission, requestMediaLibraryPermission } =
    useMediaLibraryPermission();

  // ...

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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 14,
        }}
      >
        <Button
          mode="contained"
          onPress={DecodeImage}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="picture"
            size={20}
            color={theme.colors.onPrimaryContainer}
          />
          <Text style={{ color: theme.colors.onPrimaryContainer }}>
            &nbsp;&nbsp;Escolher imagem
          </Text>
        </Button>
        {selectedImage && (
          <View
            style={{
              borderRadius: 10,
              overflow: "hidden",
              marginVertical: 14,
              padding: 10,
              backgroundColor: "white",
            }}
          >
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 160, height: 160 }}
            />
          </View>
        )}
        {!selectedImage && (
          <AntDesign name="qrcode" size={160} color={"rgb(51, 65, 85)"} />
        )}
        {code && <CopyTextComponent text={code} />}
        {link && <CopyTextComponent text={link} />}
        {isValidURL(link) && (
          <Button
            mode="contained"
            style={{ marginTop: 14 }}
            onPress={() => handleVisitSite(link)}
          >
            Visitar site
          </Button>
        )}
      </View>
    </ScrollView>
  );
};
