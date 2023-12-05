import { Chip, Text } from "react-native-paper";
import { View } from "react-native";
import { CircleBadgeComponent } from "./CircleBadgeComponent";
import { useAppTheme } from "../../theme/Theme";

interface ChipItemProps {
  filter: string;
  numberOfActivities: number;
  setFilter: (filter: string) => void;
  chipFilter: string;
  chipTitle: string;
}

export const ChipItemComponent = ({
  filter,
  numberOfActivities,
  setFilter,
  chipFilter,
  chipTitle,
}: ChipItemProps) => {
  const theme = useAppTheme();

  const active = filter === chipFilter;

  return (
    <Chip
      style={{
        backgroundColor: active
          ? theme.colors.primaryContainer
          : theme.colors.inverseOnSurface,
      }}
      onPress={() => setFilter(chipFilter)}
    >
      <View
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          gap: 6,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: active
              ? theme.colors.onPrimaryContainer
              : theme.colors.inverseSurface,
          }}
        >
          {chipTitle}
        </Text>

        <CircleBadgeComponent active={active}>
          {String(numberOfActivities)}
        </CircleBadgeComponent>
      </View>
    </Chip>
  );
};
