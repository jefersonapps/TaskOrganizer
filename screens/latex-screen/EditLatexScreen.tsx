import { RouteProp } from "@react-navigation/native";
import MathJax from "react-native-mathjax";
import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { View, ScrollView } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackLatexParamList } from "./LatexStack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { mmlOptions } from "../../constants/constants";
import { MathJaxComponent } from "./MathJaxComponent";

type SheduleNavigation = NativeStackNavigationProp<
  RootStackLatexParamList,
  "EditLatexScreen"
>;
type LatexRoute = RouteProp<RootStackLatexParamList, "EditLatexScreen">;

export const EditLatexScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<SheduleNavigation>();
  const route = useRoute<LatexRoute>();
  const { dispatchEquations } = useContext(AppContext);

  const [latex, setLatex] = useState(route.params.latexItem.code);

  const handleEditLatex = () => {
    if (!latex) return;
    dispatchEquations({
      type: "update",
      id: route.params.latexItem.id,
      code: latex,
    });
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!latex.trim()}
          icon="send"
          onPress={handleEditLatex}
        ></IconButton>
      ),
    });
  }, [navigation, latex]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
      }}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginTop: 30,
          marginBottom: 10,
          borderRadius: 8,
          elevation: 5,
          backgroundColor: "white",
        }}
      >
        <View>
          <MathJaxComponent latex={latex} />
        </View>
      </ScrollView>

      <TextInputComponent
        text={latex}
        setText={setLatex}
        label="Digite o código LaTeX"
      />
    </View>
  );
};
