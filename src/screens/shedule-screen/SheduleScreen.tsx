import React, { useState, useContext, useCallback } from "react";
import { View, PanResponder, StatusBar } from "react-native";
import LottieView from "lottie-react-native";
import {
  FAB,
  Portal,
  Dialog,
  Paragraph,
  Button,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../../theme/Theme";
import { SheduleCard } from "./SheduleCard";
import { AppContext, SheduleActivityType } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackSheduleParamList } from "./SheduleStack";
import { daysOfWeek } from "../../constants/constants";
import { TopBarComponent } from "./TopBarComponent";
import * as Haptics from "expo-haptics";
import DraggableFlatList from "react-native-draggable-flatlist";
import {
  HandlerStateChangeEvent,
  Swipeable,
} from "react-native-gesture-handler";

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

  // Função para adicionar uma nova atividade
  const addActivity = (day: string) => {
    navigation.navigate("AddSheduleActivityScreen", { day: day });
  };

  const [activitieToDelete, setActivitieToDelete] = useState<string | null>(
    null
  );

  const handleDelete = useCallback((id: string) => {
    setActivitieToDelete(id);
  }, []);

  const [selectedSchedulesActivities, setSelectedScheduleActivities] = useState<
    ScheduleMultipleDelete[]
  >([]);

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

  const [swipeDirection, setSwipeDirection] = useState("left");

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

  interface RenderItemProps {
    item: SheduleActivityType;
    drag: () => void;
    isActive: boolean;
  }

  const handleLongPress = useCallback(
    (id: string, day: string) => {
      if (selectedSchedulesActivities.length === 0) {
        setSelectedScheduleActivities([{ id: id, day: day }]);
      }
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
  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const deleteSelectedActivities = useCallback(() => {
    handleDeleteMultiple(selectedSchedulesActivities);
    setConfirmDeleteMultiples(false);
  }, [selectedSchedulesActivities, handleDeleteMultiple]);

  const handleConfirmDeleteMultiples = useCallback(() => {
    setConfirmDeleteMultiples(true);
  }, []);

  const renderItem = ({ item, drag, isActive }: RenderItemProps) => {
    return (
      <SheduleCard
        swipeDirection={swipeDirection}
        handleDelete={handleDelete}
        handleEdit={handleUpdate}
        item={item}
        isActive={isActive}
        onDrag={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          drag();
        }}
        onLongPress={handleLongPress}
        onPress={handlePress}
        selectedSchedules={selectedSchedulesActivities}
        day={daysOfWeek[activeTab]}
      />
    );
  };

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

  const activitiesForTheDay = schedule[daysOfWeek[activeTab]];
  const selectedActivitiesForTheDay = selectedSchedulesActivities.filter(
    (activity) => activity.day === daysOfWeek[activeTab]
  );

  const handleSwipeLeft = () => {
    setActiveTab((prevTab) =>
      prevTab < daysOfWeek.length - 1 ? prevTab + 1 : prevTab
    );
  };

  const handleSwipeRight = () => {
    setActiveTab((prevTab) => (prevTab > 0 ? prevTab - 1 : prevTab));
  };

  const handleSwipe = (
    event: HandlerStateChangeEvent<Record<string, unknown>>
  ) => {
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
  };

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Portal>
        <Dialog
          visible={!!activitieToDelete}
          onDismiss={() => setActivitieToDelete(null)}
        >
          <Dialog.Title>Remover Atividade</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Tem certeza que quer remover esta atividade?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setActivitieToDelete(null)}>Cancelar</Button>
            <Button onPress={confirmDelete}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={!!confirmDeleteMultiples}
          onDismiss={() => setConfirmDeleteMultiples(false)}
        >
          <Dialog.Title>Remover Atividades</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Tem certeza que quer remover as{" "}
              {selectedSchedulesActivities.length} atividades selecionadas?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDeleteMultiples(false)}>
              Cancelar
            </Button>
            <Button onPress={deleteSelectedActivities}>Sim</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* Botões de apagar */}
      {selectedSchedulesActivities.length > 0 ? (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: StatusBar.currentHeight,
            paddingVertical: 6,
            paddingHorizontal: 14,
          }}
        >
          <Button
            style={{ marginRight: 14 }}
            icon={
              selectedActivitiesForTheDay.length === activitiesForTheDay.length
                ? "circle"
                : "circle-outline"
            }
            mode="outlined"
            onPress={selectAllScheduleActivities}
          >
            Todas
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirmDeleteMultiples}
            icon="delete"
          >
            Apagar: {selectedSchedulesActivities.length}
          </Button>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: StatusBar.currentHeight ?? 18 + 12,
            paddingBottom: 12,
            paddingHorizontal: 14,
            backgroundColor: theme.colors.customBackground,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.surfaceDisabled,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.colors.primary,
              paddingVertical: 4,
            }}
          >
            Agenda Semanal
          </Text>
        </View>
      )}

      <TopBarComponent setActiveTab={setActiveTab} activeTab={activeTab} />

      {schedule[daysOfWeek[activeTab]]?.length > 0 ? (
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
              paddingTop: 14,
            }}
            data={schedule[daysOfWeek[activeTab]] || []}
            renderItem={renderItem}
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
          <LottieView
            autoPlay
            style={{
              width: 160,
              height: 160,
            }}
            source={require("../../lottie-files/beach-vacation.json")}
          />
        </Swipeable>
      )}

      <View
        style={{
          position: "absolute",
          left: 0,
          bottom: 12,
          zIndex: 999,
          width: "100%",
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          {...panResponder.panHandlers}
          style={{
            padding: 10,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.surfaceDisabled,
            width: 150,
            height: 50,
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLottieViewVisible && (
            <LottieView
              autoPlay
              style={{
                width: 60,
                height: 60,
              }}
              source={require("../../lottie-files/swipe3.json")}
            />
          )}
        </View>
      </View>

      {selectedSchedulesActivities.length > 0 && (
        <FAB
          style={{
            position: "absolute",
            margin: 16,
            left: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: theme.colors.surfaceVariant,
          }}
          icon="window-close"
          onPress={() => setSelectedScheduleActivities([])}
        />
      )}

      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        icon="plus"
        onPress={() => addActivity(daysOfWeek[activeTab])}
      />
    </View>
  );
};
