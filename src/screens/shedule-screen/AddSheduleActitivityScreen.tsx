import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { memo, useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, RadioButton, Text } from "react-native-paper";
import { RadioButtonComponent } from "../../components/RadioButtonComponent";
import { TextInputComponent } from "../../components/TextInputComponent";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { RootStackSheduleParamList } from "./SheduleStack";

type ActivitiesNavigation =
  NativeStackNavigationProp<RootStackSheduleParamList>;

type AddRoute = RouteProp<
  RootStackSheduleParamList,
  "AddSheduleActivityScreen"
>;

export const AddSheduleActivitieScreen = memo(() => {
  const route = useRoute<AddRoute>();
  const [activityText, setActivityText] = useState("");
  const [activityTitle, setActivityTitle] = useState("");
  const [sheduleDay, setSheduleDay] = useState("");
  const [priority, setPriority] = useState("baixa");

  useEffect(() => {
    if (route.params) {
      setSheduleDay(route.params?.day);
    }
  }, [route]);

  const { sheduleDispatch } = useContext(AppContext);
  const navigation = useNavigation<ActivitiesNavigation>();

  const handleAdd = () => {
    if ((!activityText.trim() && !activityTitle.trim()) || !sheduleDay) return;
    setActivityText("");

    sheduleDispatch({
      type: "add",
      day: sheduleDay,
      text: activityText,
      title: activityTitle,
      priority: priority,
    });
    navigation.goBack();
  };

  const theme = useAppTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!activityText.trim() && !activityTitle.trim()}
          icon="send"
          onPress={handleAdd}
        ></IconButton>
      ),
    });
  }, [navigation, activityText, activityTitle, priority]);

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: theme.colors.background,
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
    </ScrollView>
  );
});
