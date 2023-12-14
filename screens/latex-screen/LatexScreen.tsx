import React, { useCallback, useContext, useState } from "react";
import {
  View,
  FlatList,
  StatusBar,
  TouchableNativeFeedback,
} from "react-native";
import {
  Button,
  Dialog,
  Divider,
  FAB,
  Paragraph,
  Portal,
  Text,
} from "react-native-paper";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackLatexParamList } from "./LatexStack";

import { AppContext, LatexType } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { LatexItem } from "./LatexItem";
import LottieView from "lottie-react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

type SheduleNavigation = NativeStackNavigationProp<RootStackLatexParamList>;

export interface SelectedLatexType {
  id: string;
}

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

  const [selectedEquations, setSelectedEquations] = useState<
    SelectedLatexType[]
  >([]);

  const handleLongPress = useCallback(
    (id: string) => {
      if (selectedEquations.length === 0) {
        setSelectedEquations([{ id: id }]);
      }
    },
    [selectedEquations]
  );

  const handlePress = useCallback(
    (id: string) => {
      if (selectedEquations.length < 1) return;
      setSelectedEquations((prevselectedEquations) => {
        const equationExists = prevselectedEquations.find(
          (activity) => activity.id === id
        );

        if (equationExists) {
          return prevselectedEquations.filter((activity) => activity.id !== id);
        } else {
          return [...prevselectedEquations, { id: id }];
        }
      });
    },
    [selectedEquations]
  );

  const handleDeleteMultiple = useCallback((equations: SelectedLatexType[]) => {
    equations.forEach((eq) => {
      dispatchEquations({ type: "delete", id: eq.id });
    });
    setSelectedEquations([]);
  }, []);
  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const deleteselectedEquations = useCallback(() => {
    handleDeleteMultiple(selectedEquations);
    setConfirmDeleteMultiples(false);
  }, [selectedEquations, handleDeleteMultiple]);

  const handleConfirmDeleteMultiples = useCallback(() => {
    setConfirmDeleteMultiples(true);
  }, []);

  const selectAllEquations = useCallback(() => {
    if (equations.length === 0) return;
    setSelectedEquations(
      equations.map((eq) => ({
        id: eq.id,
      }))
    );
  }, [equations]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
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
        <Dialog
          visible={!!confirmDeleteMultiples}
          onDismiss={() => setConfirmDeleteMultiples(false)}
        >
          <Dialog.Title>Remover Equações</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Tem certeza que quer remover as {selectedEquations.length}{" "}
              equações selecionadas?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDeleteMultiples(false)}>
              Cancelar
            </Button>
            <Button onPress={deleteselectedEquations}>Sim</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {selectedEquations.length > 0 ? (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: StatusBar.currentHeight,
            paddingVertical: 6,
            paddingHorizontal: 14,
          }}
        >
          <Button
            style={{ marginRight: 14 }}
            icon={
              selectedEquations.length === equations.length
                ? "circle"
                : "circle-outline"
            }
            mode="outlined"
            onPress={selectAllEquations}
          >
            Todas
          </Button>

          <Button
            mode="contained"
            onPress={handleConfirmDeleteMultiples}
            icon="delete"
          >
            {selectedEquations.length}
          </Button>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: StatusBar.currentHeight ?? 18 + 12,
            paddingBottom: 12,
            paddingHorizontal: 14,
            backgroundColor: theme.colors.customBackground,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.surfaceDisabled,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.colors.primary,
              paddingVertical: 4,
            }}
          >
            Equações
          </Text>
        </View>
      )}

      {equations.length > 0 ? (
        <View style={{ flex: 1, width: "100%" }}>
          <DraggableFlatList
            contentContainerStyle={{ paddingBottom: 80 }}
            data={equations}
            ItemSeparatorComponent={() => <Divider style={{ width: "100%" }} />}
            renderItem={({ item: eq, drag, isActive }) => {
              return (
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "#807e7e15",
                    false
                  )}
                  onPress={() => handlePress(eq.id)}
                  onLongPress={() => handleLongPress(eq.id)}
                  useForeground
                >
                  <View style={{ flex: 1, alignItems: "stretch" }}>
                    <LatexItem
                      item={eq}
                      handleDeleteEquation={handleDeleteEquation}
                      handleAddLatex={() =>
                        navigation.navigate("EditLatexScreen", {
                          latexItem: eq,
                        })
                      }
                      selectedEquations={selectedEquations}
                      onDrag={drag}
                      isActive={isActive}
                      onPress={handlePress}
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            }}
            keyExtractor={(file) => file.id}
            onDragEnd={({ data }) =>
              dispatchEquations({ type: "reorder", newOrder: data })
            }
          />
        </View>
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
      {selectedEquations.length > 0 && (
        <FAB
          style={{
            position: "absolute",
            margin: 16,
            left: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: theme.colors.surfaceVariant,
          }}
          icon="window-close"
          onPress={() => setSelectedEquations([])}
        />
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
