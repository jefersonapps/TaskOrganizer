import { AntDesign } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { AlertComponent } from "../../components/AlertComponent";
import { AppContext } from "../../contexts/AppContext";
import { handleVisitSite, showToast } from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";
import { CopyTextComponent } from "./qr-code-components/CopyTextComponent";
import { RecentScans } from "./qr-code-components/RecentScans";

import validator from "validator";
const options = {
  require_protocol: false,
  require_valid_protocol: false,
  allow_underscores: true,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
};

export const ReadQRTab = () => {
  const theme = useAppTheme();
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { recentReaders, setRecentReaders } = useContext(AppContext);

  const [confirmClearHistory, setConfirmClearHistory] = useState(false);

  const [imagePickerStatus, requestImagePickerPermission] =
    ImagePicker.useCameraPermissions();

  const [isLoading, setIsLoading] = useState(false);

  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [imagePickerStatus]);

  const DecodeImage = async () => {
    try {
      if (!imagePickerStatus?.granted) {
        requestImagePickerPermission();
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
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
        setSelectedImage(uri);
        try {
          setIsLoading(true);
          const results = await BarCodeScanner.scanFromURLAsync(uri);
          if (results.length > 0) {
            handleReadImageScanned(results[0]);
            setRecentReaders((prev) => [
              ...prev,
              { imageUri: uri, content: results[0].data },
            ]);
          } else {
            handleReadImageScanned({ data: "Nenhum código encontrado!" });
            setRecentReaders((prev) => [
              ...prev,
              {
                imageUri: uri,
                content: "Nenhum código encontrado!",
              },
            ]);
          }
        } catch (error) {
          console.debug(error);
          handleReadImageScanned({ data: "Nenhum código encontrado!" });
        }
      }
    } catch (error) {
      console.debug(error);
      showToast("Erro ao abrir a galeria, feche o app e tente novamente...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadImageScanned = useCallback(({ data }: { data: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (validator.isURL(data, options)) {
      setLink(String(data));
      setCode("");
    } else {
      setLink("");
      setCode(String(data));
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AlertComponent
        content="Tem certeza que quer limpar todo o histórico?"
        title="Limpar Histórico"
        visible={!!confirmClearHistory}
        confirmText="Limpar"
        onConfirm={() => {
          setRecentReaders([]);
          setConfirmClearHistory(false);
        }}
        dismissText="Cancelar"
        onDismiss={() => setConfirmClearHistory(false)}
      />
      <View style={styles.container}>
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
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={[
                styles.image,
                {
                  borderColor: theme.colors.primary,
                },
              ]}
            />
            {isLoading && (
              <LottieView
                ref={lottieRef}
                autoPlay
                style={{
                  position: "absolute",
                  width: 180,
                  height: 180,
                }}
                source={require("../../lottie-files/scanner-bar-animation.json")}
              />
            )}
          </View>
        )}
        {!selectedImage && (
          <AntDesign
            name="qrcode"
            size={200}
            color={theme.colors.surfaceDisabled}
          />
        )}
        {code && <CopyTextComponent text={code} />}
        {link && <CopyTextComponent text={link} validateLink />}
        {validator.isURL(link, options) && (
          <Button
            mode="contained"
            style={{ marginTop: 14 }}
            onPress={() => handleVisitSite(link)}
          >
            Visitar site
          </Button>
        )}
      </View>

      <View style={{ padding: 14 }}>
        <RecentScans
          recentScans={[...recentReaders].reverse()}
          setConfirmClearHistory={setConfirmClearHistory}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 14,
    padding: 10,
    position: "relative",
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
    borderWidth: 2,
  },
});
