import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { captureRef } from "react-native-view-shot";
import { TextInputComponent } from "../../components/TextInputComponent";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { RootStackLatexParamList } from "./LatexStack";
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
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
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

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
