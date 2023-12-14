import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button, Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { CopyTextComponent } from "./CopyTextComponent";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { useContext, useEffect, useRef, useState } from "react";
import { handleVisitSite, isValidURL } from "../../helpers/helperFunctions";

import { GetPermission } from "../../components/GetPermission";

import { useCameraPermission } from "../../Hooks/usePermission";

export const ScannerTab = () => {
  const theme = useAppTheme();

  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");

  const { cameraPermission, requestCameraPermission } = useCameraPermission();

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

  const ScannerView = () => (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );

  const ScannerOverlay = () => {
    const lottieRef = useRef<LottieView>(null);

    useEffect(() => {
      lottieRef.current?.reset();
      lottieRef.current?.play();
    }, [cameraPermission]);
    return (
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <View style={{ flex: 1, backgroundColor: "gray", opacity: 0.75 }} />
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "gray", opacity: 0.75 }} />
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 250,
                height: 250,
                borderRadius: 4,
                borderWidth: 4,
                borderColor: "white",

                zIndex: 10,
              }}
            />
            <LottieView
              ref={lottieRef}
              autoPlay
              style={{
                position: "absolute",
                width: 250,
                height: 250,
              }}
              source={require("../../lottie-files/scanner-bar-animation.json")}
            />
          </View>
          <View style={{ flex: 1, backgroundColor: "gray", opacity: 0.75 }} />
        </View>
        <View style={{ flex: 1, backgroundColor: "gray", opacity: 0.75 }} />
      </View>
    );
  };

  const ScannerInstructions = () => (
    <View
      style={{
        position: "absolute",
        top: 4,
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 20,
      }}
    >
      <Text
        style={{
          color: "rgba(255, 255, 255, 0.6)",
          textAlign: "justify",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        Aponte a câmera para algum código QR ou código de barras...
      </Text>
    </View>
  );

  const ActionButtons = () => (
    <View
      style={{
        width: "100%",
        position: "absolute",
        paddingHorizontal: 14,
        bottom: 0,
        gap: 14,
      }}
    >
      {code && <CopyTextComponent text={code} numberOfLines={4} />}
      {link && <CopyTextComponent text={link} numberOfLines={4} />}
      <View
        style={{
          flexDirection: isValidURL(link) ? "row" : "column",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 14,
        }}
      >
        {scanned && (
          <Button
            mode="contained"
            style={{
              backgroundColor: theme.colors.primaryContainer,
              padding: 3,
              borderRadius: 10,
            }}
            onPress={() => {
              setScanned(false);
              setCode("");
              setLink("");
            }}
          >
            <Text
              style={{
                color: theme.colors.inverseSurface,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Repetir
            </Text>
          </Button>
        )}
        {isValidURL(link) && (
          <Button
            mode="contained"
            style={{
              backgroundColor: "#34d399",
              padding: 3,
              borderRadius: 10,
              marginLeft: scanned ? 10 : 0,
            }}
            onPress={() => handleVisitSite(link)}
          >
            <Text
              style={{
                color: theme.colors.inverseSurface,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Link
            </Text>
          </Button>
        )}
      </View>
    </View>
  );

  if (cameraPermission === "denied") {
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
    <View style={{ flex: 1 }}>
      <ScannerView />
      <ScannerOverlay />
      {!scanned && <ScannerInstructions />}

      <ActionButtons />
    </View>
  );
};
