import { Dispatch, SetStateAction } from "react";
import { TextInput } from "react-native-paper";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface SearchBarComponentProps {
  searchWidth: SharedValue<number>;

  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}
export const SearchBarComponent = ({
  searchWidth,

  setIsSearchOpen,
  setSearchQuery,
}: SearchBarComponentProps) => {
  const searchStyle = useAnimatedStyle(() => {
    return {
      width: `${searchWidth.value}%`,
    };
  });

  return (
    <Animated.View style={[searchStyle, { overflow: "hidden" }]}>
      <TextInput
        style={{ height: 52 }}
        onChangeText={(text) => setSearchQuery(text)}
        autoFocus
        left={<TextInput.Icon icon="magnify" />}
        right={
          <TextInput.Icon
            icon="close"
            onPress={() => {
              searchWidth.value = withTiming(
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
  );
};
