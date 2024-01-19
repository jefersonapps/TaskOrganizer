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
  searchQuery: string;
}
export const FilesSearchBarComponent = ({
  searchHeight,
  setSearchQuery,
  setIsSearchOpen,
  DEFAULT_SEARCH_HEIGHT,
  searchQuery,
}: SearchBarComponentProps) => {
  const searchStyle = useAnimatedStyle(() => {
    return {
      height: searchHeight.value,
    };
  });

  return (
    <View style={{ paddingHorizontal: 8, width: "100%" }}>
      <Animated.View style={[searchStyle, { overflow: "hidden" }]}>
        <TextInput
          style={{ height: DEFAULT_SEARCH_HEIGHT }}
          onChangeText={(text) => setSearchQuery(text)}
          autoFocus
          value={searchQuery}
          placeholder="Busque arquivos..."
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
