import { View } from "react-native";
import { Text } from "react-native-paper";

export const ScannerInstructions = () => (
  <View
    style={{
      position: "absolute",
      width: "100%",
      top: 4,
    }}
  >
    <View style={{ paddingHorizontal: 14 }}>
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
  </View>
);
