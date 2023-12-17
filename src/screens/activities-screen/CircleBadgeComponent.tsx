import { ReactNode } from "react";
import { useAppTheme } from "../../theme/Theme";
import { View } from "react-native";
import { Text } from "react-native-paper";

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
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: -8,
        backgroundColor: active
          ? theme.colors.primaryContainer
          : theme.colors.inverseOnSurface,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
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
