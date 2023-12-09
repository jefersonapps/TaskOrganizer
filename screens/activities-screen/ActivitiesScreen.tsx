import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
  useMemo,
} from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityType,
  AppContext,
  NotificationIdType,
} from "../../contexts/AppContext";
import { RootStackParamList } from "./ActivitiesStack";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  Button,
  Paragraph,
  Portal,
  Dialog,
  FAB,
  Title,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { CardComponent } from "./CardComponent";
import { ChipItemComponent } from "./ChipItemComponent";
import { ProgressBar } from "../../components/ProgressBar";
import { CircleBadgeComponent } from "./CircleBadgeComponent";
import { cancelNotification } from "../../helpers/helperFunctions";
import { LinearGradient } from "expo-linear-gradient";
import DraggableFlatList from "react-native-draggable-flatlist";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

type ActivitiesRoute = RouteProp<RootStackParamList, "EditActivity">;
type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

export type FilterType =
  | "all"
  | "completed"
  | "todo"
  | "withDeadline"
  | "withPriority";

type PriorityLevels = {
  [key: string]: number;
  alta: number;
  media: number;
  baixa: number;
};

export const ActivitiesScreen = memo(() => {
  const route = useRoute<ActivitiesRoute>();
  const navigation = useNavigation<ActivitiesNavigation>();
  const { activities, activitiesDispatch, image } = useContext(AppContext);

  const [activitieToDelete, setActivitieToDelete] = useState<{
    id: string;
    identifier: NotificationIdType;
  } | null>(null);

  const [filter, setFilter] = useState<FilterType>("todo");

  const theme = useAppTheme();

  useEffect(() => {
    if (navigation.isFocused() && route.params?.activity) {
      activitiesDispatch({ type: "update", activity: route.params.activity });
    }
  }, [navigation]);

  const handleDelete = useCallback(
    (id: string, identifier: NotificationIdType) => {
      setActivitieToDelete({ id: id, identifier: identifier });
    },
    []
  );

  const confirmDelete = useCallback(() => {
    if (activitieToDelete) {
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

  const checkActivity = useCallback(
    (id: string, identifier: NotificationIdType) => {
      activitiesDispatch({ type: "check", id: id });
      if (identifier?.notificationIdBeginOfDay) {
        cancelNotification(identifier.notificationIdBeginOfDay);
      }
      if (identifier?.notificationIdExactTime) {
        cancelNotification(identifier.notificationIdExactTime);
      }
    },
    [activities]
  );

  const goToAddActivity = useCallback(() => {
    navigation.navigate("Add");
  }, []);

  function convertToDateTime(dateStr: string, timeStr: string) {
    const time = timeStr || "00:00";
    const dateTimeStr = dateStr + " " + time;
    return dayjs(dateTimeStr, "DD/MM/YYYY HH:mm");
  }

  const priorityLevels: PriorityLevels = {
    alta: 3,
    media: 2,
    baixa: 1,
  };

  const [filteredActivities, setFilteredActivities] = useState<ActivityType[]>(
    []
  );

  useEffect(() => {
    let newFilteredActivities = activities.filter((activity) => {
      if (filter === "all") return true;
      if (filter === "completed") return activity.checked;
      if (filter === "todo") return !activity.checked;
      if (filter === "withDeadline") return activity.deliveryDay;
      if (filter === "withPriority") return activity.priority;
    });

    if (filter === "withPriority") {
      newFilteredActivities.sort((a, b) => {
        return priorityLevels[b.priority] - priorityLevels[a.priority];
      });
    }
    if (filter === "withDeadline") {
      newFilteredActivities.sort((a, b) => {
        const dateTimeA = convertToDateTime(a.deliveryDay, a.deliveryTime);
        const dateTimeB = convertToDateTime(b.deliveryDay, b.deliveryTime);
        return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
      });
    }

    setFilteredActivities(newFilteredActivities);
  }, [activities, filter]);

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

  const checkedActivitiesSize = useMemo(() => {
    return activities.filter((activity) => activity.checked).length;
  }, [activities]);

  const totalActivities = useMemo(() => {
    return activities.length;
  }, [activities]);

  const percentageOfCheckedActivities = useMemo(() => {
    return totalActivities > 0
      ? (checkedActivitiesSize / totalActivities) * 100
      : 0;
  }, [activities]);

  const withDeadlineActivitiesSize = useMemo(() => {
    return activities.filter((activity) => activity.deliveryDay).length;
  }, [activities]);

  const withPriorityActivitiesSize = useMemo(() => {
    return activities.filter((activity) => activity.priority).length;
  }, [activities]);

  interface RenderItemProps {
    item: ActivityType; // Substitua YourItemType pelo tipo real do seu item
    drag: () => void;
    isActive: boolean;
  }

  const renderItem = ({ item, drag, isActive }: RenderItemProps) => {
    return (
      //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      <CardComponent
        item={item}
        handleDelete={handleDelete}
        checkActivity={checkActivity}
        isActive={isActive}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          drag();
        }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "flex-start",
        paddingTop: StatusBar.currentHeight,
      }}
    >
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 15,
          alignItems: "center",
        }}
      >
        <Title
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: theme.colors.primary,
          }}
        >
          {greeting}!
        </Title>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Ajustes")}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: "#34d399",
                borderWidth: 4,
              }}
            />
          ) : (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: "#34d399",
                borderWidth: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="person"
                size={30}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <ProgressBar progressPercentage={percentageOfCheckedActivities} />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 14,
          paddingBottom: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              gap: 16,
              paddingRight: 48,
              marginTop: 15,
              marginBottom: 5,
              height: 40,
            }}
          >
            <ChipItemComponent
              chipFilter="todo"
              filter={filter}
              numberOfActivities={totalActivities - checkedActivitiesSize}
              setFilter={setFilter}
              chipTitle="A fazer"
            />
            <ChipItemComponent
              chipFilter="completed"
              filter={filter}
              numberOfActivities={checkedActivitiesSize}
              setFilter={setFilter}
              chipTitle="Feitas"
            />
            <ChipItemComponent
              chipFilter="withDeadline"
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            paddingHorizontal: 8,
          }}
        >
          <LinearGradient
            // Background Linear Gradient
            colors={["transparent", theme.colors.surface || "gray"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: "100%",
              width: 40,
              position: "absolute",
              left: -40,
            }}
          />
          <Text style={{ fontWeight: "bold" }}>Total: </Text>
          <CircleBadgeComponent active={false}>
            {String(totalActivities)}
          </CircleBadgeComponent>
        </View>
      </View>

      {filteredActivities.length > 0 ? (
        ["all", "completed", "todo"].includes(filter) ? (
          <View style={{ flex: 1 }}>
            <DraggableFlatList
              contentContainerStyle={{ paddingBottom: 80 }}
              data={filteredActivities}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setFilteredActivities(data)}
            />
          </View>
        ) : (
          <FlatList
            data={filteredActivities}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <CardComponent
                item={item}
                handleDelete={handleDelete}
                checkActivity={checkActivity}
                onLongPress={() => {}}
              />
            )}
          />
        )
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <LottieView
            autoPlay
            style={{
              width: 160,
              height: 160,
            }}
            source={require("../../lottie-files/beach-vacation.json")}
          />
        </View>
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
        onPress={goToAddActivity}
      />
    </View>
  );
});
