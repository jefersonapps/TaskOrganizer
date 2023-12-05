import React, { useCallback, useContext, useState } from "react";
import { View, FlatList } from "react-native";
import { Button, Dialog, FAB, Paragraph, Portal } from "react-native-paper";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackLatexParamList } from "./LatexStack";

import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { LatexItem } from "./LatexItem";
import LottieView from "lottie-react-native";

type SheduleNavigation = NativeStackNavigationProp<RootStackLatexParamList>;

export const LatexScreen = () => {
  const theme = useAppTheme();
  const { equations, dispatchEquations } = useContext(AppContext);
  const [equationToDelete, setEquationToDelete] = useState<string | null>(null);

  const navigation = useNavigation<SheduleNavigation>();

  const handleAddLatex = () => {
    navigation.navigate("AddLatexActivityScreen");
  };

  const handleDeleteEquation = useCallback((id: string) => {
    setEquationToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (equationToDelete) {
      dispatchEquations({
        type: "delete",
        id: equationToDelete,
      });
    }
    setEquationToDelete(null);
  }, [equationToDelete]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
      }}
    >
      <Portal>
        <Dialog
          visible={!!equationToDelete}
          onDismiss={() => setEquationToDelete(null)}
        >
          <Dialog.Title>Remover Equação</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Tem certeza que quer remover esta equação?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEquationToDelete(null)}>Cancelar</Button>
            <Button onPress={confirmDelete}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {equations.length > 0 ? (
        <FlatList
          data={equations}
          renderItem={({ item }) => (
            <LatexItem
              item={item}
              handleDeleteEquation={handleDeleteEquation}
              handleAddLatex={() =>
                navigation.navigate("EditLatexScreen", { latexItem: item })
              }
            />
          )}
          keyExtractor={(item, index) => item.id}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <LottieView
            autoPlay
            style={{
              width: 160,
              height: 160,
            }}
            source={require("../../lottie-files/maths.json")}
          />
        </View>
      )}
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        icon="plus"
        onPress={() => handleAddLatex()}
      />
    </View>
  );
};
