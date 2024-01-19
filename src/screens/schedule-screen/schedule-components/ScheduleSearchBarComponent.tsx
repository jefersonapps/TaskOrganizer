import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface SearchBarComponentProps {
  searchHeight: SharedValue<number>;

  setSearchQuery: Dispatch<SetStateAction<string>>;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  DEFAULT_SEARCH_HEIGHT: number;
}
export const ScheduleSearchBarComponent = ({
  searchHeight,
  setSearchQuery,
  setIsSearchOpen,
  DEFAULT_SEARCH_HEIGHT,
}: SearchBarComponentProps) => {
  const searchStyle = useAnimatedStyle(() => {
    return {
      height: searchHeight.value,
    };
  });

  return (
    <View style={{ paddingHorizontal: 8 }}>
      <Animated.View
        style={[searchStyle, { overflow: "hidden", width: "100%" }]}
      >
        <TextInput
          style={{ height: DEFAULT_SEARCH_HEIGHT }}
          onChangeText={(text) => setSearchQuery(text)}
          autoFocus
          left={<TextInput.Icon icon="magnify" />}
          right={
            <TextInput.Icon
              icon="close"
              onPress={() => {
                searchHeight.value = withTiming(
                  0,
                  {
                    duration: 500,
                  },
                  () => {
                    runOnJS(setIsSearchOpen)(false);
                    runOnJS(setSearchQuery)("");
                  }
                );
              }}
            />
          }
        />
      </Animated.View>
    </View>
  );
};
