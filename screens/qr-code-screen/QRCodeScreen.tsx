import React, { useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "../../theme/Theme";

import { ScannerTab } from "./ScannerTab";
import { CreateQRComponent } from "./CreateQRComponent";
import { ReadQRTab } from "./ReadQRTab";
import { TopBarQRComponent } from "./TopBarQRComponent";

export const QRCodeScreen = () => {
  const theme = useAppTheme();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = { scanner: 0, createQR: 1, readImage: 2 };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
        {activeTab === tabs["scanner"] && <ScannerTab />}
        {activeTab === tabs["createQR"] && <CreateQRComponent />}
        {activeTab === tabs["readImage"] && <ReadQRTab />}
      </View>
    </View>
  );
};
