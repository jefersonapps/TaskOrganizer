import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Text,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAppTheme } from "../../theme/Theme";
import { CopyTextComponent } from "./CopyTextComponent";
import * as Haptics from "expo-haptics";
import { handleVisitSite, isValidURL } from "../../helpers/helperFunctions";
import { AppContext, Scan } from "../../contexts/AppContext";
import LottieView from "lottie-react-native";

interface RecentScans {
  recentScans: Scan[];
  setConfirmClearHistory: (value: boolean) => void;
}

export const RecentScans = ({
  recentScans,
  setConfirmClearHistory,
}: RecentScans) => {
  return (
    <Card style={{ width: "100%" }}>
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Histórico</Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 14, textAlign: "justify" }}
            >
              Aqui estão suas leituras recentes
            </Text>
          </View>
          <IconButton
            icon="broom"
            mode="contained"
            style={{ marginRight: -4 }}
            onPress={() => {
              setConfirmClearHistory(true);
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                gap: 14,
                padding: 4,
              }}
            >
              {recentScans.length > 0 ? (
                recentScans.map((scan, index) => (
                  <Card key={index} style={{ width: 160 }}>
                    <Image
                      source={{ uri: scan.imageUri ?? undefined }}
                      style={{ width: 160, height: 160, borderRadius: 8 }}
                    />

                    <CopyTextComponent text={scan.content} validateLink />
                  </Card>
                ))
              ) : (
                <View
                  style={{
                    height: 160,
                    width: 160,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>Nenhum código QR foi lido recentemente...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
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

  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [imagePickerStatus]);

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

  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Portal>
        <Dialog
          visible={!!confirmClearHistory}
          onDismiss={() => setConfirmClearHistory(false)}
        >
          <Dialog.Title>Limpar Histórico</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Tem certeza que quer limpar todo o histórico?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmClearHistory(false)}>
              Cancelar
            </Button>
            <Button
              onPress={() => {
                setRecentReaders([]);
                setConfirmClearHistory(false);
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
              position: "relative",
            }}
          >
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: 160,
                height: 160,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: theme.colors.primary,
              }}
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

      <View style={{ padding: 14 }}>
        <RecentScans
          recentScans={recentReaders.reverse()}
          setConfirmClearHistory={setConfirmClearHistory}
        />
      </View>
    </ScrollView>
  );
};
