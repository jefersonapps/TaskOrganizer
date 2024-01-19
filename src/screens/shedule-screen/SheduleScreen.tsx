import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { PanResponder, StatusBar, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import DraggableFlatList from "react-native-draggable-flatlist";
import {
  HandlerStateChangeEvent,
  Swipeable,
} from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { AlertComponent } from "../../components/AlertComponent";
import { FABComponent } from "../../components/FABComponent";
import { SelectMultiplesComponent } from "../../components/SelectMultiplesComponent";
import { daysOfWeek } from "../../constants/constants";
import { AppContext, SheduleActivityType } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { RootStackSheduleParamList } from "./SheduleStack";
import { NotFoundSchedule } from "./schedule-components/NotFoundSchedule";
import { ScheduleHeader } from "./schedule-components/ScheduleHeader";
import { ScheduleSearchBarComponent } from "./schedule-components/ScheduleSearchBarComponent";
import { SwipeComponent } from "./schedule-components/SwipeComponent";
import { TopBarComponent } from "./schedule-components/TopBarComponent";
import { renderScheduleItem } from "./schedule-components/renderScheduleItem";

type SheduleNavigation = NativeStackNavigationProp<RootStackSheduleParamList>;

export type ScheduleMultipleDelete = {
  day: string;
  id: string;
};

export const ScheduleScreen = () => {
  const theme = useAppTheme();

  const { schedule, sheduleDispatch } = useContext(AppContext);
  const navigation = useNavigation<SheduleNavigation>();
  const [isLottieViewVisible, setLottieViewVisible] = useState(true);

  const [activeTab, setActiveTab] = useState(0);

  const [activitieToDelete, setActivitieToDelete] = useState<string | null>(
    null
  );
  const [selectedSchedulesActivities, setSelectedScheduleActivities] = useState<
    ScheduleMultipleDelete[]
  >([]);

  const [swipeDirection, setSwipeDirection] = useState("left");

  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchHeight = useSharedValue(0);

  const DEFAULT_SEARCH_HEIGHT = 52;

  const activitiesForTheDay = schedule[daysOfWeek[activeTab]];

  const selectedActivitiesForTheDay = selectedSchedulesActivities.filter(
    (activity) => activity.day === daysOfWeek[activeTab]
  );

  const addActivity = (day: string) => {
    navigation.navigate("AddSheduleActivityScreen", { day: day });
  };

  const handleDelete = useCallback((id: string) => {
    setActivitieToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (activitieToDelete) {
      sheduleDispatch({
        type: "delete",
        day: daysOfWeek[activeTab],
        id: activitieToDelete,
      });
      setSelectedScheduleActivities((prevSelectedSchedules) => {
        return prevSelectedSchedules.filter(
          (activity) => activity.id !== activitieToDelete
        );
      });
    }
    setActivitieToDelete(null);
  }, [activitieToDelete, activeTab]);

  const handleUpdate = useCallback(
    (id: string) => {
      const day = daysOfWeek[activeTab];
      const dayActivities = schedule[day];
      const activity = dayActivities?.find((a) => a.id === id);

      if (activity) {
        navigation.navigate("EditSheduleActivityScreen", { activity, day });
      }
    },
    [activeTab, schedule]
  );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (event, gestureState) => {
      setLottieViewVisible(false);
      if (gestureState.dx > 0) {
        // Swipe right
        setSwipeDirection("right");
        setActiveTab((prevTab) => (prevTab > 0 ? prevTab - 1 : prevTab));
      } else if (gestureState.dx < 0) {
        // Swipe left
        setSwipeDirection("left");
        setActiveTab((prevTab) =>
          prevTab < daysOfWeek.length - 1 ? prevTab + 1 : prevTab
        );
      }
    },
  });

  const handleLongPress = useCallback(
    (id: string, day: string) => {
      if (selectedSchedulesActivities.length === 0) {
        setSelectedScheduleActivities([{ id: id, day: day }]);
      }
      setIsSearchOpen(false);
    },
    [selectedSchedulesActivities]
  );

  const handlePress = useCallback(
    (id: string, day: string) => {
      if (selectedSchedulesActivities.length < 1) return;
      setSelectedScheduleActivities((prevSelectedActivities) => {
        const activityExists = prevSelectedActivities.find(
          (activity) => activity.id === id
        );

        if (activityExists) {
          return prevSelectedActivities.filter(
            (activity) => activity.id !== id
          );
        } else {
          return [...prevSelectedActivities, { id: id, day: day }];
        }
      });
    },
    [selectedSchedulesActivities]
  );

  const handleDeleteMultiple = useCallback(
    (activities: ScheduleMultipleDelete[]) => {
      activities.forEach((activity) => {
        sheduleDispatch({
          type: "delete",
          id: activity.id,
          day: activity.day,
        });
      });
      setSelectedScheduleActivities([]);
    },
    []
  );

  const deleteSelectedActivities = useCallback(() => {
    handleDeleteMultiple(selectedSchedulesActivities);
    setConfirmDeleteMultiples(false);
    setSearchQuery("");
  }, [selectedSchedulesActivities, handleDeleteMultiple]);

  const handleConfirmDeleteMultiples = useCallback(() => {
    setConfirmDeleteMultiples(true);
  }, []);

  const onDragEnd = useCallback(
    (data: SheduleActivityType[]) => {
      sheduleDispatch({
        type: "reorder",
        day: daysOfWeek[activeTab],
        activities: data,
      });
    },
    [activeTab]
  );

  const selectAllScheduleActivities = useCallback(() => {
    if (schedule[daysOfWeek[activeTab]].length === 0) return;

    setSelectedScheduleActivities((prev) => {
      const newActivities = schedule[daysOfWeek[activeTab]]
        .filter(
          (activity) => !prev.some((selected) => selected.id === activity.id)
        )
        .map((activity) => ({
          id: activity.id,
          day: daysOfWeek[activeTab],
        }));

      return [...prev, ...newActivities];
    });
  }, [schedule, activeTab]);

  const filterActivitiesByText = useCallback(
    (activities: SheduleActivityType[], query: string) => {
      if (!query) {
        return activities;
      }

      const normalizedQuery = query.toLowerCase();
      const filterActivityArray = (activityArray: SheduleActivityType[]) =>
        activityArray.filter(
          (activity) =>
            activity.text.toLowerCase().includes(normalizedQuery) ||
            activity.title.toLowerCase().includes(normalizedQuery)
        );

      const filtered = filterActivityArray(activities);
      return filtered;
    },
    []
  );

  const filteredActivitiesByText = filterActivitiesByText(
    schedule[daysOfWeek[activeTab]],
    searchQuery
  );

  const handleSwipeLeft = useCallback(() => {
    setActiveTab((prevTab) =>
      prevTab < daysOfWeek.length - 1 ? prevTab + 1 : prevTab
    );
  }, []);

  const handleSwipeRight = useCallback(() => {
    setActiveTab((prevTab) => (prevTab > 0 ? prevTab - 1 : prevTab));
  }, []);

  const handleSwipe = useCallback(
    (event: HandlerStateChangeEvent<Record<string, unknown>>) => {
      setLottieViewVisible(false);

      if (
        event.nativeEvent.velocityX &&
        Number(event.nativeEvent.velocityX) > 0
      ) {
        handleSwipeRight();
        setSwipeDirection("right");
      } else if (
        event.nativeEvent.velocityX &&
        Number(event.nativeEvent.velocityX) < 0
      ) {
        handleSwipeLeft();
        setSwipeDirection("left");
      }
    },
    []
  );

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <AlertComponent
        title="Remover Atividade"
        content="Tem certeza que quer remover esta atividade?"
        visible={!!activitieToDelete}
        confirmText="Remover"
        onConfirm={confirmDelete}
        dismissText="Cancelar"
        onDismiss={() => setActivitieToDelete(null)}
      />

      <AlertComponent
        title="Remover Atividades"
        content={
          selectedSchedulesActivities.length > 1
            ? `Tem certeza que quer remover as ${selectedSchedulesActivities.length} atividades selecionadas?`
            : "Tem certeza que quer remover a atividade selecionada?"
        }
        visible={!!confirmDeleteMultiples}
        dismissText="Cancelar"
        onDismiss={() => setConfirmDeleteMultiples(false)}
        confirmText="Remover"
        onConfirm={deleteSelectedActivities}
      />

      {selectedSchedulesActivities.length > 0 ? (
        <SelectMultiplesComponent
          allSelected={
            selectedActivitiesForTheDay.length === activitiesForTheDay.length
          }
          handleConfirmDeleteMultiples={handleConfirmDeleteMultiples}
          selectAllItems={selectAllScheduleActivities}
          selectedItems={selectedSchedulesActivities}
          style={{ paddingTop: StatusBar.currentHeight, marginVertical: 4 }}
        />
      ) : (
        <ScheduleHeader
          isSearchOpen={isSearchOpen}
          searchHeight={searchHeight}
          setIsSearchOpen={setIsSearchOpen}
          DEFAULT_SEARCH_HEIGHT={DEFAULT_SEARCH_HEIGHT}
        />
      )}

      <TopBarComponent setActiveTab={setActiveTab} activeTab={activeTab} />
      {isSearchOpen && (
        <ScheduleSearchBarComponent
          searchHeight={searchHeight}
          setIsSearchOpen={setIsSearchOpen}
          setSearchQuery={setSearchQuery}
          DEFAULT_SEARCH_HEIGHT={DEFAULT_SEARCH_HEIGHT}
        />
      )}
      {filteredActivitiesByText.length > 0 ? (
        <Swipeable
          containerStyle={{
            flex: 1,
          }}
          onActivated={handleSwipe}
        >
          <DraggableFlatList
            contentContainerStyle={{
              paddingBottom: 80,
              backgroundColor: theme.colors.surface,
            }}
            data={filteredActivitiesByText || []}
            renderItem={({ drag, isActive, item }) =>
              renderScheduleItem({
                day: daysOfWeek[activeTab],
                drag,
                isActive,
                item,
                handleDelete,
                handleLongPress,
                handlePress,
                handleUpdate,
                selectedSchedulesActivities,
                swipeDirection,
              })
            }
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => onDragEnd(data)}
          />
        </Swipeable>
      ) : (
        <Swipeable
          containerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          onActivated={handleSwipe}
        >
          <NotFoundSchedule update={activeTab} />
        </Swipeable>
      )}

      <SwipeComponent
        isLottieViewVisible={isLottieViewVisible}
        panResponder={panResponder}
        style={styles.swipe}
      />

      {selectedSchedulesActivities.length > 0 && (
        <FAB
          style={[
            styles.cancelFab,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          icon="window-close"
          onPress={() => setSelectedScheduleActivities([])}
        />
      )}

      <FABComponent
        style={styles.addFab}
        icon="plus"
        action={() => addActivity(daysOfWeek[activeTab])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  swipe: {
    position: "absolute",
    left: 0,
    bottom: 12,
    zIndex: 999,
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelFab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    zIndex: 999,
  },
  addFab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
