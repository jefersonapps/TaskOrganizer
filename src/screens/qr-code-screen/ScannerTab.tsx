import { BarCodeScanner } from "expo-barcode-scanner";
import { StyleSheet, View } from "react-native";

import * as Haptics from "expo-haptics";

import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useTabIndex } from "react-native-paper-tabs";
import validator from "validator";
import { GetPermission } from "../../components/GetPermission";
import { ActionButtons } from "./qr-code-components/ActionButtons";
import { ScannerInstructions } from "./qr-code-components/ScannerInstructions";
import { ScannerOverlay } from "./qr-code-components/ScannerOverlay";
const options = {
  require_protocol: false,
  require_valid_protocol: false,
  allow_underscores: true,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
};

export const ScannerTab = () => {
  const index = useTabIndex();
  const isFocused = useIsFocused();
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [key, setKey] = useState<"reload" | "reload-again">("reload");

  useEffect(() => {
    if (index === 2 || isFocused) {
      setKey((prev) => (prev === "reload" ? "reload-again" : "reload"));
      setScanned(false);
      setLink("");
      setCode("");
    }
  }, [index, isFocused]);

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
    setScanned(false);
  };

  useEffect(() => {
    if (!hasPermission) {
      getBarCodeScannerPermissions();
    }
  }, [hasPermission]);

  const handleBarCodeScanned = useCallback(({ data }: { data: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (validator.isURL(data, options)) {
      setLink(String(data));
      setScanned(true);
      setCode("");
    } else {
      setLink("");
      setCode(String(data));
      setScanned(true);
    }
  }, []);

  if (!hasPermission) {
    return (
      <GetPermission
        getPermissionAfterSetInConfigs={getBarCodeScannerPermissions}
        title="A câmera não está disponível"
        content="Desculpe, parece que não conseguimos acessar a câmera do seu
      dispositivo. Por favor, verifique as configurações de permissão da
      câmera e tente novamente."
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        key={key}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[
          StyleSheet.absoluteFillObject,
          { transform: [{ scale: 1.06 }] },
        ]}
      />

      <ScannerOverlay hasPermission={hasPermission} scanned={scanned} />
      {!scanned && <ScannerInstructions />}

      <ActionButtons
        code={code}
        link={link}
        scanned={scanned}
        setCode={setCode}
        setLink={setLink}
        setScanned={setScanned}
        setKey={setKey}
      />
    </View>
  );
};
