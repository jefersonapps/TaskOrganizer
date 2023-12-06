import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button, Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { CopyTextComponent } from "./CopyTextComponent";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { handleVisitSite, isValidURL } from "../../helpers/helperFunctions";
import * as ImagePicker from "expo-image-picker";
import { GetPermission } from "../../components/GetPermission";

export const ScannerTab = () => {
  const theme = useAppTheme();

  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");

  const [cameraPermission, setCameraPermission] =
    useState<ImagePicker.PermissionStatus>();

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setCameraPermission(status);
    };

    requestCameraPermission();
  }, []);

  if (cameraPermission === "denied" || cameraPermission === undefined) {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setCameraPermission(status);
    };

    return (
      <GetPermission getPermissionAfterSetInConfigs={requestCameraPermission} />
    );
  }

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

  const ScannerOverlay = () => (
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
      {code && <CopyTextComponent text={code} />}
      {link && <CopyTextComponent text={link} />}
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

  return (
    <View style={{ flex: 1 }}>
      <ScannerView />
      <ScannerOverlay />
      {!scanned && <ScannerInstructions />}

      <ActionButtons />
    </View>
  );
};
