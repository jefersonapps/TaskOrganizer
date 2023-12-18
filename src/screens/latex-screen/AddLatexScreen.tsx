import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackLatexParamList } from "./LatexStack";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { MathJaxComponent } from "./MathJaxComponent";
import { captureRef } from "react-native-view-shot";

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
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
      }}
    >
      {/* <ScrollView
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
      > */}
      {/* <View style={{ height: 300, width: 300 }}> */}
      {/* <MathJaxComponent latex={latex} /> */}
      {/* </View> */}
      {/* </ScrollView> */}

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
