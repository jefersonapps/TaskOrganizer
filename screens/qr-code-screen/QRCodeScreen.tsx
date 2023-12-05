import React, { useState, useEffect, useRef } from "react";
import { View, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Linking from "expo-linking";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useAppTheme } from "../../theme/Theme";
import { ScannerTab } from "./ScannerTab";
import { CreateQRComponent } from "./CreateQRComponent";
import { ReadQRTab } from "./ReadQRTab";
import { TopBarQRComponent } from "./TopBarQRComponent";

import { CustomAlert } from "../../components/CustomAlert";

export const QRCodeScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [linkRead, setLinkRead] = useState("");
  const [code, setCode] = useState("");
  const [codeRead, setCodeRead] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSaved, setIsImageSaved] = useState(false);
  const viewShotRef = useRef(null);

  const theme = useAppTheme();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = { scanner: 0, createQR: 1, readImage: 2 };

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("É necessário ter permissão para acessar a câmera!");
      }
    };

    const requestMediaLibraryPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("É necessário ter permissão para acessar a galeria!");
      }
    };

    requestCameraPermission();
    requestMediaLibraryPermission();
  }, []);

  const isValidURL = (str: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isValidURL(data)) {
      setLink(String(data));
      setCode("");
    } else {
      setLink("");
      setCode(String(data));
    }
  };

  const handleReadImageScanned = ({ data }: { data: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isValidURL(data)) {
      setLinkRead(String(data));
      setCodeRead("");
    } else {
      setLinkRead("");
      setCodeRead(String(data));
    }
  };

  const handleVisitSite = () => {
    let fullURL = link;
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      fullURL = "https://" + link;
    }
    Linking.openURL(fullURL).catch((err) =>
      console.error("An error occurred", err)
    );
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

  const shareFile = (uri: string) => {
    Sharing.shareAsync(uri);
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomAlert
        title="Sucesso!"
        content="Imagem salva na galeria"
        isVisible={isImageSaved}
        setIsVisible={setIsImageSaved}
      />
      <View
        style={{
          justifyContent: "center",
          width: "100%",
          height: 46,
          paddingTop: 3,
          alignItems: "center",
        }}
      >
        <TopBarQRComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === tabs["scanner"] && (
          <ScannerTab
            code={code}
            handleBarCodeScanned={handleBarCodeScanned}
            handleVisitSite={handleVisitSite}
            isValidURL={isValidURL}
            link={link}
            scanned={scanned}
            setCode={setCode}
            setLink={setLink}
            setScanned={setScanned}
          />
        )}
        {activeTab === tabs["createQR"] && (
          <CreateQRComponent
            handleDownloadQRCode={handleDownloadQRCode}
            handleShareQRCode={handleShareQRCode}
            inputText={inputText}
            setInputText={setInputText}
            viewShotRef={viewShotRef}
          />
        )}
        {activeTab === tabs["readImage"] && (
          <ReadQRTab
            DecodeImage={DecodeImage}
            code={codeRead}
            handleVisitSite={handleVisitSite}
            isValidURL={isValidURL}
            link={linkRead}
            selectedImage={selectedImage}
          />
        )}
      </View>
    </View>
  );
};
