import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppContext } from "../../contexts/AppContext";
import { Button, RadioButton, Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { RootStackSheduleParamList } from "./SheduleStack";
import { TextInputComponent } from "../activities-screen/TextInputComponent";

type EditRoute = RouteProp<
  RootStackSheduleParamList,
  "EditSheduleActivityScreen"
>;
type EditNavigation = NativeStackNavigationProp<RootStackSheduleParamList>;

export const EditSheduleActivityScreen = () => {
  const route = useRoute<EditRoute>();
  const navigation = useNavigation<EditNavigation>();

  const theme = useAppTheme();

  const { sheduleDispatch } = useContext(AppContext);

  // Encontrar a atividade a ser editada no contexto global
  const activity = route.params?.activity;

  const day = route.params?.day;

  const [text, setText] = useState(activity.text);
  const [title, setTitle] = useState(activity.title || "");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="contained"
          onPress={() => {
            if (activity) {
              sheduleDispatch({
                type: "update",
                day: day, // Substitua 'Dom' pelo dia correto
                activity: {
                  id: activity.id, // Certifique-se de que 'activity' tem uma propriedade 'id'
                  text,
                  title,
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
    </ScrollView>
  );
};
