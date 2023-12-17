import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "../../theme/Theme";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackLatexParamList } from "./LatexStack";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { MathJaxComponent } from "./MathJaxComponent";

type SheduleNavigation = NativeStackNavigationProp<RootStackLatexParamList>;

export const AddLatexScreen = () => {
  const theme = useAppTheme();
  const [latex, setLatex] = useState("");
  const navigation = useNavigation<SheduleNavigation>();

  const { dispatchEquations } = useContext(AppContext);

  const handleAddLatex = () => {
    if (!latex) return;
    dispatchEquations({
      type: "add",
      code: latex,
    });
    setLatex("");
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          mode="contained"
          disabled={!latex.trim()}
          icon="send"
          onPress={handleAddLatex}
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
