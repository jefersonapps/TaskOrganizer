import { useNavigation } from "@react-navigation/native";
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

type SheduleNavigation = NativeStackNavigationProp<RootStackLatexParamList>;

export const AddLatexScreen = () => {
  const theme = useAppTheme();
  const [latex, setLatex] = useState("");
  const navigation = useNavigation<SheduleNavigation>();

  const { dispatchEquations } = useContext(AppContext);

  const codeRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddLatex = async () => {
    if (!latex) return;
    if (!codeRef.current) return;

    setIsLoading(true);

    const localUri = await captureRef(codeRef, {
      height: 440,
      quality: 1,
    });

    dispatchEquations({
      type: "add",
      code: latex,
      uri: localUri,
    });
    setLatex("");
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
          onPress={handleAddLatex}
        ></IconButton>
      ),
    });
  }, [navigation, latex, isLoading]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
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
