import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";
import { AlertComponent } from "../../components/AlertComponent";
import { RadioButtonComponent } from "../../components/RadioButtonComponent";
import { TextInputComponent } from "../../components/TextInputComponent";
import { AppContext } from "../../contexts/AppContext";
import {
  cancelNotification,
  getNotificationIds,
} from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";
import { RootStackParamList } from "./ActivitiesStack";
import { DateTimePickerComponent } from "./date-time-picker/DateTimePickerComponent";

type EditRoute = RouteProp<RootStackParamList, "EditActivity">;
type EditNavigation = NativeStackNavigationProp<RootStackParamList>;

export const EditActivityScreen = () => {
  const theme = useAppTheme();
  const route = useRoute<EditRoute>();
  const navigation = useNavigation<EditNavigation>();

  const { activitiesDispatch, userName } = useContext(AppContext);

  const activity = route.params?.activity;

  const [text, setText] = useState(activity?.text || "");
  const [title, setTitle] = useState(activity?.title || "");
  const [priority, setPriority] = useState(activity?.priority || "baixa");

  const [deliveryDay, setDeliveryDay] = useState(activity?.deliveryDay || "");
  const [deliveryTime, setDeliveryTime] = useState(
    activity?.deliveryTime || ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleEdit = async () => {
    if (!title && !text) return;
    if (deliveryTime && !deliveryDay) {
      setShowAlert(true);
      return;
    }
    if (activity) {
      setIsLoading(true);
      cancelNotification(
        activity.notificationId?.notificationIdBeginOfDay,
        true
      );
      cancelNotification(
        activity.notificationId?.notificationIdExactTime,
        true
      );

      const { notificationIdBeginOfDay, notificationIdExactTime } =
        await getNotificationIds(
          deliveryDay,
          deliveryTime,
          userName,
          text,
          activity.id
        );

      activitiesDispatch({
        type: "update",
        activity: {
          ...activity,
          text,
          priority,
          timeStamp: new Date().toISOString(),
          isEdited: true,
          deliveryDay: deliveryDay,
          deliveryTime: deliveryTime,
          title: title,
          notificationId: {
            notificationIdBeginOfDay: notificationIdBeginOfDay,
            notificationIdExactTime: notificationIdExactTime,
          },
        },
      });
    }
    navigation.goBack();
    setIsLoading(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="contained"
          onPress={handleEdit}
          disabled={(!text.trim() && !title.trim()) || isLoading}
        >
          Salvar
        </Button>
      ),
    });
  }, [navigation, text, title, priority, deliveryDay, deliveryTime, isLoading]);

  // Atualizar o texto sempre que a atividade se alterar
  useEffect(() => {
    setText(activity?.text || "");
  }, [activity]);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <AlertComponent
        visible={showAlert}
        title="Erro"
        content="Certifique-se de estabelecer não apenas a hora, mas também a data de entrega."
        confirmText="Entendi"
        onConfirm={() => setShowAlert(false)}
      />
      <Text variant="titleMedium">Atividade:</Text>
      <TextInputComponent
        noMultiline
        text={title}
        setText={setTitle}
        label="Novo título"
      />
      <TextInputComponent
        text={text}
        setText={setText}
        label="Novo conteúdo"
        minHeight={120}
      />

      <Text variant="titleMedium">Prioridade:</Text>
      <RadioButton.Group
        onValueChange={(newValue) => setPriority(newValue)}
        value={priority}
      >
        <View style={styles.priorityContainer}>
          <RadioButtonComponent
            setPriority={setPriority}
            label="Alta"
            value="alta"
          />
          <RadioButtonComponent
            setPriority={setPriority}
            label="Média"
            value="media"
          />
          <RadioButtonComponent
            setPriority={setPriority}
            label="Baixa"
            value="baixa"
          />
        </View>
      </RadioButton.Group>

      <DateTimePickerComponent
        deliveryDay={deliveryDay}
        setDeliveryDay={setDeliveryDay}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  priorityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
