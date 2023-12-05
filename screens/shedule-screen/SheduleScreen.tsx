import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  FlatList,
  Dimensions,
  ScrollView,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { FAB, Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../../theme/Theme";
import { SheduleCard } from "./SheduleCard";
import { AppContext } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackSheduleParamList } from "./SheduleStack";
import { daysOfWeek } from "../../constants/constants";
import { TopBarComponent } from "./TopBarComponent";

// Definindo o tipo de atividade

type SheduleNavigation = NativeStackNavigationProp<RootStackSheduleParamList>;

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

  const confirmDelete = useCallback(() => {
    if (activitieToDelete) {
      sheduleDispatch({
        type: "delete",
        day: daysOfWeek[activeTab],
        id: activitieToDelete,
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
      } else {
        // Swipe left
        setSwipeDirection("left");
        setActiveTab((prevTab) =>
          prevTab < daysOfWeek.length - 1 ? prevTab + 1 : prevTab
        );
      }
    },
  });
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

      <TopBarComponent setActiveTab={setActiveTab} activeTab={activeTab} />

      {schedule[daysOfWeek[activeTab]]?.length > 0 ? (
        <FlatList
          data={schedule[daysOfWeek[activeTab]] || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SheduleCard
              swipeDirection={swipeDirection}
              handleDelete={handleDelete}
              handleEdit={handleUpdate}
              item={item}
            />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
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
