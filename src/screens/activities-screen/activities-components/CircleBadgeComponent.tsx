import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../../theme/Theme";

interface CircleBadgeProps {
  children: ReactNode;
  active: boolean;
}

export const CircleBadgeComponent = ({
  children,
  active,
}: CircleBadgeProps) => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: active
            ? theme.colors.primaryContainer
            : theme.colors.inverseOnSurface,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <Text
        style={{
          color: theme.colors.inverseSurface,
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: -8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
