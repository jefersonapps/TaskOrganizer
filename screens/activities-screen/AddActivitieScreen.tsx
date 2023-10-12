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

type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

export const AddActivitieScreen = memo(() => {
  const [activityText, setActivityText] = useState("");
  const [priority, setPriority] = useState("baixa");
  const [deliveryDay, setDeliveryDay] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [activityTitle, setActivityTitle] = useState("");

  const { activitiesDispatch } = useContext(AppContext);
  const navigation = useNavigation<ActivitiesNavigation>();
  const handleAdd = () => {
    if (!activityText) return;
    setActivityText("");
    activitiesDispatch({
      type: "add",
      text: activityText,
      priority: priority,
      timeStamp: new Date().toISOString(),
      isEdited: false,
      deliveryDay: deliveryDay,
      deliveryTime: deliveryTime,
      title: activityTitle || "",
    });
    navigation.goBack();
  };

  const theme = useAppTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!activityText.trim()}
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
