import LottieView from "lottie-react-native";
import { View } from "react-native";

import Animated, { ZoomInRotate } from "react-native-reanimated";

export const NotFoundFile = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View entering={ZoomInRotate}>
        <LottieView
          autoPlay
          style={{
            width: 160,
            height: 160,
          }}
          source={require("../../../lottie-files/files-animation.json")}
        />
      </Animated.View>
    </View>
  );
};
