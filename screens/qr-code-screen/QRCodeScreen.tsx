import { View } from "react-native";
import { useAppTheme } from "../../theme/Theme";

import { ScannerTab } from "./ScannerTab";
import { CreateQRComponent } from "./CreateQRComponent";
import { ReadQRTab } from "./ReadQRTab";

import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";

export const QRCodeScreen = () => {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TabsProvider defaultIndex={0}>
        <Tabs
          style={{ alignItems: "center" }}
          mode="scrollable"
          showLeadingSpace={false}
        >
          <TabScreen label="Scanner" icon="qrcode-scan">
            <ScannerTab />
          </TabScreen>
          <TabScreen label="Criar QR" icon="qrcode-edit">
            <CreateQRComponent />
          </TabScreen>
          <TabScreen label="Ler QR" icon="qrcode">
            <ReadQRTab />
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  );
};
