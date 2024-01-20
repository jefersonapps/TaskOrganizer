import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import {
  ActivityState,
  ActivityType,
  AppContext,
  NotificationIdType,
} from "../../contexts/AppContext";
import { RootStackParamList } from "./ActivitiesStack";

import DraggableFlatList from "react-native-draggable-flatlist";
import { FAB } from "react-native-paper";
import { ProgressBar } from "../../components/ProgressBar";
import { cancelNotification } from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";
import { CardComponent } from "./activities-components/CardComponent";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { requestWidgetUpdate } from "react-native-android-widget";
import { MMKV } from "react-native-mmkv";
import { useSharedValue } from "react-native-reanimated";
import { AlertComponent } from "../../components/AlertComponent";
import { FABComponent } from "../../components/FABComponent";
import { AllTodosWidgets } from "../../widgets/AllTodosWidgets";
import { CheckedTodosWidget } from "../../widgets/CheckedTodosWidget";
import { DeliveryTimeWidget } from "../../widgets/DeliveryTimeWidget";
import { TodoWidget } from "../../widgets/TodoWidget";
import { FiltersComponent } from "./activities-components/FiltersComponent";
import { Header } from "./activities-components/Header";
import { SearchBarComponent } from "./activities-components/SearchBarComponent";

import { SelectMultiplesComponent } from "../../components/SelectMultiplesComponent";
import { NotFoundActivity } from "./activities-components/NotFoundActivity";
import { renderItem } from "./activities-components/renderItem";

dayjs.extend(customParseFormat);

// Cria uma nova instância de armazenamento
export const storage = new MMKV();

// Função para salvar o estado no armazenamento local
export const saveState = <T extends unknown>(key: string, state: T) => {
  storage.set(key, JSON.stringify(state));
};

// Função para recuperar o estado do armazenamento local
export const loadState = <T extends unknown>(key: string): T | undefined => {
  const state = storage.getString(key);
  return state ? (JSON.parse(state) as T) : undefined;
};

type ActivitiesRoute = RouteProp<RootStackParamList, "EditActivity">;
type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

export type FilterType =
  | "todos"
  | "checkedTodos"
  | "withDeadLine"
  | "withPriority";

export type ActivityMultipleDelete = {
  id: string;
  identifier: NotificationIdType;
};

export const ActivitiesScreen = memo(() => {
  const theme = useAppTheme();
  const route = useRoute<ActivitiesRoute>();
  const navigation = useNavigation<ActivitiesNavigation>();
  const { activities, activitiesDispatch, image } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [activitieToDelete, setActivitieToDelete] = useState<{
    id: string;
    identifier: NotificationIdType;
  } | null>(null);

  const [selectedActivities, setSelectedActivities] = useState<
    ActivityMultipleDelete[]
  >([]);

  const [percentageOfCheckedActivities, setPercentageOfCheckedActivities] =
    useState(0);

  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const [filter, setFilter] = useState<FilterType>("todos");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [filteredActivities, setFilteredActivities] = useState<ActivityState>({
    checkedTodos: [],
    todos: [],
    withDeadLine: [],
    withPriority: [],
  });

  const searchWidth = useSharedValue(0);

  const totalActivities = useMemo(() => {
    return activities.todos.length + activities.checkedTodos.length;
  }, [activities]);

  const checkedActivitiesSize = useMemo(() => {
    return activities.checkedTodos.length;
  }, [activities]);

  useEffect(() => {
    if (navigation.isFocused() && route.params?.activity) {
      activitiesDispatch({ type: "update", activity: route.params.activity });
    }
  }, [navigation]);

  useEffect(() => {
    const actualPercentageOfCheckedActivities =
      totalActivities > 0 ? (checkedActivitiesSize / totalActivities) * 100 : 0;

    setPercentageOfCheckedActivities(actualPercentageOfCheckedActivities);
  }, [totalActivities, checkedActivitiesSize]);

  useEffect(() => {
    let newFilteredActivities: ActivityState = {
      todos: [],
      checkedTodos: [],
      withDeadLine: [],
      withPriority: [],
    };

    if (filter === "checkedTodos") {
      newFilteredActivities.checkedTodos = activities.checkedTodos;
    } else if (filter === "todos") {
      newFilteredActivities.todos = activities.todos;
    } else if (filter === "withDeadLine") {
      newFilteredActivities.withDeadLine = activities.withDeadLine;
    } else if (filter === "withPriority") {
      newFilteredActivities.withPriority = activities.withPriority;
    }

    setFilteredActivities(newFilteredActivities);
  }, [activities, filter]);

  useEffect(() => {
    requestWidgetUpdate({
      widgetName: "DeliveryTimeWidget",
      renderWidget: () => <DeliveryTimeWidget />,
      widgetNotFound: () => {},
    });

    requestWidgetUpdate({
      widgetName: "TodoWidget",
      renderWidget: () => <TodoWidget />,
      widgetNotFound: () => {},
    });

    requestWidgetUpdate({
      widgetName: "CheckedTodosWidget",
      renderWidget: () => <CheckedTodosWidget />,
    });

    requestWidgetUpdate({
      widgetName: "AllTodosWidgets",
      renderWidget: () => <AllTodosWidgets />,
    });
  }, [activities]);

  const handleDelete = useCallback(
    (id: string, identifier: NotificationIdType) => {
      setActivitieToDelete({ id: id, identifier: identifier });
    },
    []
  );

  const confirmDelete = useCallback(() => {
    if (activitieToDelete) {
      setSelectedActivities((prevSelectedActivities) => {
        return prevSelectedActivities.filter(
          (activity) => activity.id !== activitieToDelete.id
        );
      });

      activitiesDispatch({ type: "delete", id: activitieToDelete.id });
    }
    setActivitieToDelete(null);

    if (activitieToDelete?.identifier?.notificationIdBeginOfDay) {
      cancelNotification(
        activitieToDelete?.identifier.notificationIdBeginOfDay
      );
    }
    if (activitieToDelete?.identifier?.notificationIdExactTime) {
      cancelNotification(activitieToDelete?.identifier.notificationIdExactTime);
    }
  }, [activitieToDelete]);

  const handleLongPress = useCallback(
    (id: string, identifier: NotificationIdType) => {
      if (selectedActivities.length === 0) {
        setSelectedActivities([{ id, identifier }]);
        setIsSearchOpen(false);
      }
    },
    [selectedActivities]
  );

  const handlePress = useCallback(
    (id: string, identifier: NotificationIdType) => {
      if (selectedActivities.length < 1) return;
      setSelectedActivities((prevSelectedActivities) => {
        const activityExists = prevSelectedActivities.find(
          (activity) => activity.id === id
        );

        if (activityExists) {
          return prevSelectedActivities.filter(
            (activity) => activity.id !== id
          );
        } else {
          return [...prevSelectedActivities, { id, identifier }];
        }
      });
    },
    [selectedActivities]
  );

  const handleDeleteMultiple = useCallback(
    (activities: ActivityMultipleDelete[]) => {
      activities.forEach((activity) => {
        activitiesDispatch({ type: "delete", id: activity.id });

        if (activity.identifier?.notificationIdBeginOfDay) {
          cancelNotification(activity.identifier.notificationIdBeginOfDay);
        }
        if (activity.identifier?.notificationIdExactTime) {
          cancelNotification(activity.identifier.notificationIdExactTime);
        }
      });
      setSelectedActivities([]);
      setSearchQuery("");
    },
    []
  );

  const deleteSelectedActivities = useCallback(() => {
    handleDeleteMultiple(selectedActivities);
    setConfirmDeleteMultiples(false);
  }, [selectedActivities, handleDeleteMultiple]);

  const handleConfirmDeleteMultiples = useCallback(() => {
    setConfirmDeleteMultiples(true);
  }, []);

  const checkActivity = useCallback(
    async (id: string, identifier: NotificationIdType) => {
      activitiesDispatch({ type: "check", id: id });
      if (identifier?.notificationIdBeginOfDay) {
        cancelNotification(identifier.notificationIdBeginOfDay);
      }
      if (identifier?.notificationIdExactTime) {
        cancelNotification(identifier.notificationIdExactTime);
      }

      setIsSearchOpen(false);
    },
    [activities]
  );

  const goToAddActivity = useCallback(() => {
    navigation.navigate("Add");
  }, []);

  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Bom dia";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  }, []);

  const selectAllActivities = useCallback(() => {
    if (filteredActivities[filter].length === 0) return;
    setSelectedActivities(
      filteredActivities[filter].map((activity) => ({
        id: activity.id,
        identifier: activity.notificationId ? activity.notificationId : null,
      }))
    );
  }, [filteredActivities]);

  const filterActivitiesByText = useCallback(
    (activities: ActivityState, query: string) => {
      if (!query) {
        return activities;
      }

      const normalizedQuery = query.toLowerCase();
      const filterActivityArray = (activityArray: ActivityType[]) =>
        activityArray.filter(
          (activity) =>
            activity.text.toLowerCase().includes(normalizedQuery) ||
            activity.title.toLowerCase().includes(normalizedQuery)
        );

      return {
        todos: filterActivityArray(activities.todos),
        checkedTodos: filterActivityArray(activities.checkedTodos),
        withDeadLine: filterActivityArray(activities.withDeadLine),
        withPriority: filterActivityArray(activities.withPriority),
      };
    },
    []
  );

  const filteredActivitiesByText = filterActivitiesByText(
    filteredActivities,
    searchQuery
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AlertComponent
        visible={!!activitieToDelete}
        title="Remover Atividade"
        content="Tem certeza que quer remover esta atividade?"
        confirmText="Remover"
        dismissText="Cancelar"
        onConfirm={confirmDelete}
        onDismiss={() => setActivitieToDelete(null)}
      />

      <AlertComponent
        visible={!!confirmDeleteMultiples}
        title="Remover Atividades"
        content={
          selectedActivities.length > 1
            ? `Tem certeza que quer remover as ${selectedActivities.length} atividades selecionadas?`
            : "Tem certeza que quer remover a atividade selecionada?"
        }
        confirmText="Remover"
        dismissText="Cancelar"
        onConfirm={deleteSelectedActivities}
        onDismiss={() => setConfirmDeleteMultiples(false)}
      />

      <Header
        greeting={greeting}
        image={image}
        onImagePress={() => navigation.navigate("Ajustes")}
      />

      <View style={{ paddingHorizontal: 16 }}>
        <ProgressBar progressPercentage={percentageOfCheckedActivities} />
      </View>

      {selectedActivities.length > 0 ? (
        <SelectMultiplesComponent
          handleConfirmDeleteMultiples={handleConfirmDeleteMultiples}
          selectAllItems={selectAllActivities}
          selectedItems={selectedActivities}
          allSelected={
            selectedActivities.length === filteredActivities[filter].length
          }
        />
      ) : (
        <View style={styles.actionBar}>
          {isSearchOpen && (
            <SearchBarComponent
              searchWidth={searchWidth}
              setIsSearchOpen={setIsSearchOpen}
              setSearchQuery={setSearchQuery}
            />
          )}

          <FiltersComponent
            filter={filter}
            isSearchOpen={isSearchOpen}
            searchWidth={searchWidth}
            setFilter={setFilter}
            setIsSearchOpen={setIsSearchOpen}
          />
        </View>
      )}

      {filteredActivitiesByText[filter].length > 0 ? (
        ["todos", "checkedTodos"].includes(filter) && !searchQuery ? (
          <View style={{ flex: 1 }}>
            <DraggableFlatList
              contentContainerStyle={{ paddingBottom: 80 }}
              data={filteredActivities[filter]}
              renderItem={({ drag, isActive, item }) =>
                renderItem({
                  drag,
                  checkActivity,
                  handleDelete,
                  handleLongPress,
                  handlePress,
                  isActive,
                  item,
                  selectedActivities,
                })
              }
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => {
                activitiesDispatch({
                  type: "reorder",
                  listName: filter,
                  newOrder: data,
                });
              }}
            />
          </View>
        ) : (
          <FlatList
            data={filteredActivitiesByText[filter]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <CardComponent
                item={item}
                handleDelete={handleDelete}
                checkActivity={checkActivity}
                onLongPress={handleLongPress}
                onPress={handlePress}
                selectedActivities={selectedActivities}
              />
            )}
          />
        )
      ) : (
        <NotFoundActivity update={filter} />
      )}
      {selectedActivities.length > 0 && (
        <FAB
          style={[
            styles.fabLeft,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          icon="window-close"
          onPress={() => {
            setSelectedActivities([]);
            setSearchQuery("");
          }}
        />
      )}
      <FABComponent
        action={goToAddActivity}
        icon="plus"
        style={styles.fabRight}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "flex-start",
    paddingTop: StatusBar.currentHeight,
  },
  actionBar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 14,
    paddingBottom: 8,
    alignItems: "center",
    paddingTop: 8,
  },
  fabLeft: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    zIndex: 999,
  },
  fabRight: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
