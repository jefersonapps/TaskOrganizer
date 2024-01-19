import { Dispatch, SetStateAction } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Animated, {
  BounceIn,
  SharedValue,
  ZoomOut,
  withSpring,
} from "react-native-reanimated";
import { useAppTheme } from "../../../theme/Theme";

interface FilesHeaderProps {
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  searchHeight: SharedValue<number>;
  DEFAULT_SEARCH_HEIGHT: number;
}

export const FilesHeader = ({
  isSearchOpen,
  setIsSearchOpen,
  searchHeight,
  DEFAULT_SEARCH_HEIGHT,
}: FilesHeaderProps) => {
  const theme = useAppTheme();

  const handleClose = () => {
    setIsSearchOpen(true);
    searchHeight.value = withSpring(DEFAULT_SEARCH_HEIGHT, {
      damping: 13,
    });
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.customBackground,
          borderBottomColor: theme.colors.surfaceDisabled,
          paddingTop: StatusBar.currentHeight
            ? StatusBar.currentHeight + 8
            : 32 + 8,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.primary,
          }}
        >
          Arquivos
        </Text>

        {!isSearchOpen && (
          <Animated.View
            entering={BounceIn}
            exiting={ZoomOut}
            style={styles.icon}
          >
            <IconButton icon="magnify" mode="contained" onPress={handleClose} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  icon: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
