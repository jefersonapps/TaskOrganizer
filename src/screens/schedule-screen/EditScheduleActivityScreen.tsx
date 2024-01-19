import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";
import { RadioButtonComponent } from "../../components/RadioButtonComponent";
import { TextInputComponent } from "../../components/TextInputComponent";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { RootStackScheduleParamList } from "./ScheduleStack";

type EditRoute = RouteProp<
  RootStackScheduleParamList,
  "EditScheduleActivityScreen"
>;
type EditNavigation = NativeStackNavigationProp<RootStackScheduleParamList>;

export const EditScheduleActivityScreen = () => {
  const route = useRoute<EditRoute>();
  const navigation = useNavigation<EditNavigation>();

  const theme = useAppTheme();

  const { scheduleDispatch } = useContext(AppContext);

  // Encontrar a atividade a ser editada no contexto global
  const activity = route.params?.activity;

  const day = route.params?.day;

  const [text, setText] = useState(activity.text);
  const [title, setTitle] = useState(activity.title || "");
  const [priority, setPriority] = useState("baixa");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="contained"
          onPress={() => {
            if (activity) {
              scheduleDispatch({
                type: "update",
                day: day,
                activity: {
                  id: activity.id,
                  text,
                  title,
                  priority: priority,
                },
              });
            }
            navigation.goBack();
          }}
        >
          Salvar
        </Button>
      ),
    });
  }, [navigation, text, title]);

  // Atualizar o texto sempre que a atividade se alterar
  useEffect(() => {
    setText(activity.text || "");
    setTitle(activity.title || "");
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
        label="Novo Título"
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
    </ScrollView>
  );
};
