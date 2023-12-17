import { memo, useState, useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { TextInputComponent } from "./TextInputComponent";
import { IconButton, RadioButton, Text } from "react-native-paper";
import { AppContext } from "../../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./ActivitiesStack";
import { RadioButtonComponent } from "./priority/RadioButtonComponent";
import { DateTimePickerComponent } from "./date-time-picker/DateTimePickerComponent";
import * as Crypto from "expo-crypto";

import { getNotificationIds } from "../../helpers/helperFunctions";

type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

export const AddActivitieScreen = memo(() => {
  const [activityText, setActivityText] = useState("");
  const [priority, setPriority] = useState("baixa");
  const [deliveryDay, setDeliveryDay] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [activityTitle, setActivityTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { activitiesDispatch, userName } = useContext(AppContext);
  const navigation = useNavigation<ActivitiesNavigation>();

  const handleAdd = async () => {
    if (!activityText) return;

    setIsLoading(true);
    const id = Crypto.randomUUID();

    const { notificationIdBeginOfDay, notificationIdExactTime } =
      await getNotificationIds(
        deliveryDay,
        deliveryTime,
        userName,
        activityText,
        id
      );

    activitiesDispatch({
      id: id,
      type: "add",
      text: activityText,
      priority: priority,
      timeStamp: new Date().toISOString(),
      isEdited: false,
      deliveryDay: deliveryDay,
      deliveryTime: deliveryTime,
      title: activityTitle || "",
      checked: false,
      notificationId: {
        notificationIdBeginOfDay: notificationIdBeginOfDay,
        notificationIdExactTime: notificationIdExactTime,
      },
    });

    setActivityText("");
    navigation.goBack();
    setIsLoading(false);
  };

  const theme = useAppTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!activityText.trim() || isLoading}
          icon="send"
          onPress={handleAdd}
        ></IconButton>
      ),
    });
  }, [
    navigation,
    activityText,
    activityTitle,
    priority,
    deliveryDay,
    deliveryTime,
    isLoading,
  ]);

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
        text={activityTitle}
        setText={setActivityTitle}
        noMultiline
        label="Digite o título"
      />
      <TextInputComponent
        text={activityText}
        setText={setActivityText}
        label="Digite o conteúdo"
      />

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
        setDeliveryDay={setDeliveryDay}
        setDeliveryTime={setDeliveryTime}
      />
    </ScrollView>
  );
});
