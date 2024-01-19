import { StyleSheet, View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { useAppTheme } from "../../../theme/Theme";
import { FilterType } from "../ActivitiesScreen";
import { CircleBadgeComponent } from "./CircleBadgeComponent";

interface ChipItemProps {
  filter: string;
  numberOfActivities: number;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  chipFilter: FilterType;
  chipTitle: string;
  nobg?: boolean;
  mode?: "flat" | "outlined";
}

export const ChipItemComponent = ({
  filter,
  numberOfActivities,
  setFilter,
  chipFilter,
  chipTitle,
  nobg,
  mode,
}: ChipItemProps) => {
  const theme = useAppTheme();

  const active = filter === chipFilter;

  return (
    <Chip
      mode={mode ? mode : "flat"}
      style={{
        backgroundColor: active
          ? theme.colors.primaryContainer
          : nobg
          ? theme.colors.surface
          : theme.colors.inverseOnSurface,
      }}
      onPress={() => setFilter(chipFilter)}
    >
      <View style={styles.content}>
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

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 6,
  },
});
