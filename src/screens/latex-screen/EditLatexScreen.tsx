import { RouteProp } from "@react-navigation/native";
import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { View, ScrollView } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackLatexParamList } from "./LatexStack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { MathJaxComponent } from "./MathJaxComponent";
import { captureRef } from "react-native-view-shot";

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

  const codeRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleEditLatex = async () => {
    if (!latex) return;

    if (!codeRef.current) return;

    setIsLoading(true);

    const localUri = await captureRef(codeRef, {
      height: 440,
      quality: 1,
    });

    dispatchEquations({
      type: "update",
      id: route.params.latexItem.id,
      code: latex,
      uri: localUri,
    });
    navigation.goBack();
    setIsLoading(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!latex.trim() || isLoading}
          icon="send"
          onPress={handleEditLatex}
        ></IconButton>
      ),
    });
  }, [navigation, latex, isLoading]);

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
          backgroundColor: "white",
        }}
      >
        <View style={{ padding: 2 }} ref={codeRef} collapsable={false}>
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
