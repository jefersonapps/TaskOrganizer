import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";

interface ScannerOverlayProps {
  hasPermission: boolean;
  scanned: boolean;
}
export const ScannerOverlay = ({
  hasPermission,
  scanned,
}: ScannerOverlayProps) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.reset();
    lottieRef.current?.play();
  }, [hasPermission]);
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
            loop={!scanned}
            autoPlay
            style={{
              position: "absolute",
              width: 250,
              height: 250,
            }}
            source={require("../../../lottie-files/scanner-bar-animation.json")}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: "gray", opacity: 0.75 }} />
      </View>
      <View style={{ flex: 1, backgroundColor: "gray", opacity: 0.75 }} />
    </View>
  );
};
