import { Dispatch, SetStateAction, useContext, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import Animated, {
  BounceIn,
  SharedValue,
  ZoomOut,
  withSpring,
} from "react-native-reanimated";
import { AppContext } from "../../../contexts/AppContext";
import { FilterType } from "../ActivitiesScreen";
import { ChipItemComponent } from "./ChipItemComponent";

interface FiltersComponentProps {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
  searchWidth: SharedValue<number>;
}
export const FiltersComponent = ({
  filter,
  setFilter,
  isSearchOpen,
  setIsSearchOpen,
  searchWidth,
}: FiltersComponentProps) => {
  const { activities } = useContext(AppContext);

  const totalActivities = useMemo(() => {
    return activities.todos.length + activities.checkedTodos.length;
  }, [activities]);

  const checkedActivitiesSize = useMemo(() => {
    return activities.checkedTodos.length;
  }, [activities]);

  const withDeadlineActivitiesSize = useMemo(() => {
    return activities.withDeadLine.length;
  }, [activities]);

  const withPriorityActivitiesSize = useMemo(() => {
    return activities.withPriority.length;
  }, [activities]);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 44,
        }}
      >
        <Animated.View
          entering={BounceIn}
          exiting={ZoomOut}
          style={[{ alignItems: "center" }]}
        >
          {!isSearchOpen && (
            <Animated.View entering={BounceIn}>
              <IconButton
                icon="magnify"
                onPress={() => {
                  setIsSearchOpen(true);
                  searchWidth.value = withSpring(100);
                }}
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <ChipItemComponent
          chipFilter="todos"
          filter={filter}
          numberOfActivities={totalActivities - checkedActivitiesSize}
          setFilter={setFilter}
          chipTitle="A fazer"
        />
        <ChipItemComponent
          chipFilter="checkedTodos"
          filter={filter}
          numberOfActivities={checkedActivitiesSize}
          setFilter={setFilter}
          chipTitle="Feitas"
        />
        <ChipItemComponent
          chipFilter="withDeadLine"
          filter={filter}
          numberOfActivities={withDeadlineActivitiesSize}
          setFilter={setFilter}
          chipTitle="Prazo"
        />
        <ChipItemComponent
          chipFilter="withPriority"
          filter={filter}
          numberOfActivities={withPriorityActivitiesSize}
          setFilter={setFilter}
          chipTitle="Prioridade"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  scrollViewStyle: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 48,
    height: 40,
    paddingLeft: 8,
  },
});
