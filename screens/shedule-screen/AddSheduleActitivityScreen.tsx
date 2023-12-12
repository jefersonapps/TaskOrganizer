import { memo, useState, useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { IconButton, RadioButton, Text } from "react-native-paper";
import { AppContext } from "../../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notify from "expo-notifications";
import { RootStackSheduleParamList } from "./SheduleStack";
import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { RadioButtonComponent } from "../activities-screen/priority/RadioButtonComponent";
import { DateTimePickerComponent } from "../activities-screen/date-time-picker/DateTimePickerComponent";
import { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

type ActivitiesNavigation =
  NativeStackNavigationProp<RootStackSheduleParamList>;

type AddRoute = RouteProp<
  RootStackSheduleParamList,
  "AddSheduleActivityScreen"
>;

export const AddSheduleActivitieScreen = memo(() => {
  const route = useRoute<AddRoute>();
  const [activityText, setActivityText] = useState("");
  const [priority, setPriority] = useState("baixa");
  const [deliveryDay, setDeliveryDay] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [activityTitle, setActivityTitle] = useState("");
  const [sheduleDay, setSheduleDay] = useState("");

  useEffect(() => {
    if (route.params) {
      setSheduleDay(route.params?.day);
    }
  }, [route]);

  const { sheduleDispatch } = useContext(AppContext);
  const navigation = useNavigation<ActivitiesNavigation>();

  const handleAdd = () => {
    if (!activityText || !sheduleDay) return;
    setActivityText("");

    sheduleDispatch({
      type: "add",
      day: sheduleDay,
      text: activityText,
      title: activityTitle,
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
  }, [navigation, activityText, activityTitle]);

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
        noMultiline
      />
      <TextInputComponent
        text={activityText}
        setText={setActivityText}
        label="Digite o conteúdo"
      />
    </ScrollView>
  );
});
