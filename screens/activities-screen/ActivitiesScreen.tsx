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
import { ActivityType, AppContext } from "../../contexts/AppContext";
import { RootStackParamList } from "./ActivitiesStack";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";

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

type ActivitiesRoute = RouteProp<RootStackParamList, "EditActivity">;
type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

export const ActivitiesScreen = memo(() => {
  const route = useRoute<ActivitiesRoute>();
  const navigation = useNavigation<ActivitiesNavigation>();
  const { activities, activitiesDispatch, image } = useContext(AppContext);

  const [activitieToDelete, setActivitieToDelete] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState("todo");

  const theme = useAppTheme();

  useEffect(() => {
    if (navigation.isFocused() && route.params?.activity) {
      activitiesDispatch({ type: "update", activity: route.params.activity });
    }
  }, [navigation]);

  const handleDelete = useCallback((id: string) => {
    setActivitieToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (activitieToDelete) {
      activitiesDispatch({ type: "delete", id: activitieToDelete });
    }
    setActivitieToDelete(null);
  }, [activitieToDelete]);

  const checkActivity = useCallback(
    (id: string) => {
      activitiesDispatch({ type: "check", id: id });
    },
    [activities]
  );

  const goToAddActivity = useCallback(() => {
    navigation.navigate("Add");
  }, []);

  console.log("render activity");

  const filteredActivities = useMemo(() => {
    // Filtre todas as atividades de uma vez
    const newFilteredActivities = activities.filter((activity) => {
      if (filter === "all") return true;
      if (filter === "completed") return activity.checked;
      if (filter === "todo") return !activity.checked;
    });

    // Retorne as atividades filtradas
    return newFilteredActivities;
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

  const checkedActivities = useMemo(() => {
    return activities.filter((activity) => activity.checked).length;
  }, [activities]);

  const totalActivities = useMemo(() => {
    return activities.length;
  }, [activities]);

  const percentageOfCheckedActivities = useMemo(() => {
    return totalActivities > 0
      ? (checkedActivities / totalActivities) * 100
      : 0;
  }, [activities]);

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

      <View style={{ alignItems: "center" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 16,
            paddingHorizontal: 16,
            marginTop: 15,
            marginBottom: 5,
            height: 40,
          }}
        >
          <ChipItemComponent
            chipFilter="todo"
            filter={filter}
            numberOfActivities={totalActivities - checkedActivities}
            setFilter={setFilter}
            chipTitle="A fazer"
          />
          <ChipItemComponent
            chipFilter="completed"
            filter={filter}
            numberOfActivities={checkedActivities}
            setFilter={setFilter}
            chipTitle="Feitas"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Total: </Text>
            <CircleBadgeComponent active={false}>
              {String(totalActivities)}
            </CircleBadgeComponent>
          </View>
        </ScrollView>
      </View>

      {filteredActivities && filteredActivities.length > 0 ? (
        <FlatList
          data={activities} // Use the original activities array
          extraData={filter} // Add the filter variable as extraData
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => {
            if (
              filter === "all" ||
              (filter === "completed" && item.checked) ||
              (filter === "todo" && !item.checked)
            ) {
              return (
                <CardComponent
                  item={item}
                  handleDelete={handleDelete}
                  checkActivity={checkActivity}
                />
              );
            } else {
              return null;
            }
          }}
        />
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
