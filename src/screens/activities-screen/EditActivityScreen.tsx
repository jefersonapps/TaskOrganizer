import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppContext } from "../../contexts/AppContext";
import { RootStackParamList } from "./ActivitiesStack";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { RadioButtonComponent } from "./priority/RadioButtonComponent";
import { DateTimePickerComponent } from "./date-time-picker/DateTimePickerComponent";
import { TextInputComponent } from "./TextInputComponent";
import {
  cancelNotification,
  getNotificationIds,
} from "../../helpers/helperFunctions";

type EditRoute = RouteProp<RootStackParamList, "EditActivity">;
type EditNavigation = NativeStackNavigationProp<RootStackParamList>;

export const EditActivityScreen = () => {
  const route = useRoute<EditRoute>();
  const navigation = useNavigation<EditNavigation>();

  const theme = useAppTheme();

  const { activities, activitiesDispatch, userName } = useContext(AppContext);

  const activity = activities.find((a) => a.id === route.params?.activity.id);

  const [text, setText] = useState(activity?.text || "");
  const [title, setTitle] = useState(activity?.title || "");
  const [priority, setPriority] = useState(activity?.priority || "baixa");

  const [deliveryDay, setDeliveryDay] = useState(activity?.deliveryDay || "");
  const [deliveryTime, setDeliveryTime] = useState(
    activity?.deliveryTime || ""
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    if (activity) {
      setIsLoading(true);
      cancelNotification(activity.notificationId?.notificationIdBeginOfDay);
      cancelNotification(activity.notificationId?.notificationIdExactTime);

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
          disabled={!text.trim() || isLoading}
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
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
      }}
    >
      <Text variant="titleMedium">Atividade:</Text>
      <TextInputComponent
        noMultiline
        text={title}
        setText={setTitle}
        label="Novo título"
      />
      <TextInputComponent text={text} setText={setText} label="Novo conteúdo" />

      <Text variant="titleMedium">Prioridade:</Text>
      <RadioButton.Group
        onValueChange={(newValue) => setPriority(newValue)}
        value={priority}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",

            justifyContent: "center",
          }}
        >
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
