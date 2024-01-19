import LottieView from "lottie-react-native";
import { Key } from "react";
import { View } from "react-native";

import Animated, { ZoomInRotate } from "react-native-reanimated";

interface NotFoundScheduleProps {
  update: Key;
}

export const NotFoundSchedule = ({ update }: NotFoundScheduleProps) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View entering={ZoomInRotate} key={update}>
        <LottieView
          autoPlay
          style={{
            width: 160,
            height: 160,
          }}
          source={require("../../../lottie-files/beach-vacation.json")}
        />
      </Animated.View>
    </View>
  );
};
