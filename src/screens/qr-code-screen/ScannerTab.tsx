import { BarCodeScanner } from "expo-barcode-scanner";
import { StyleSheet, View } from "react-native";

import * as Haptics from "expo-haptics";

import { useCallback, useEffect, useState } from "react";
import { GetPermission } from "../../components/GetPermission";
import { isValidURL } from "../../helpers/helperFunctions";
import { ActionButtons } from "./qr-code-components/ActionButtons";
import { ScannerInstructions } from "./qr-code-components/ScannerInstructions";
import { ScannerOverlay } from "./qr-code-components/ScannerOverlay";

export const ScannerTab = () => {
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    if (!hasPermission) {
      getBarCodeScannerPermissions();
    }
  }, [hasPermission]);

  const handleBarCodeScanned = useCallback(({ data }: { data: string }) => {
    setScanned(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isValidURL(data)) {
      setLink(String(data));
      setCode("");
    } else {
      setLink("");
      setCode(String(data));
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
      />
    </View>
  );
};
