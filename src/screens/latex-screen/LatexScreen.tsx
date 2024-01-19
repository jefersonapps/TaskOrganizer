import React, { useCallback, useContext, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Divider, FAB } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackLatexParamList } from "./LatexStack";

import DraggableFlatList from "react-native-draggable-flatlist";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { LatexItem } from "./LatexItem";

import * as Haptics from "expo-haptics";
import { AlertComponent } from "../../components/AlertComponent";
import { FABComponent } from "../../components/FABComponent";
import { SelectMultiplesComponent } from "../../components/SelectMultiplesComponent";
import { LatexHeader } from "./latex-components/LatexHeader";
import { NotFoundLatex } from "./latex-components/NotFoundLatex";

type SheduleNavigation = NativeStackNavigationProp<RootStackLatexParamList>;

export interface SelectedLatexType {
  id: string;
}

export const LatexScreen = () => {
  const theme = useAppTheme();
  const { equations, dispatchEquations } = useContext(AppContext);
  const [equationToDelete, setEquationToDelete] = useState<string | null>(null);

  const [selectedEquations, setSelectedEquations] = useState<
    SelectedLatexType[]
  >([]);
  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const navigation = useNavigation<SheduleNavigation>();

  const handleAddLatex = useCallback(() => {
    navigation.navigate("AddLatexActivityScreen");
    setSelectedEquations([]);
  }, []);

  const handleDeleteEquation = useCallback((id: string) => {
    setEquationToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (equationToDelete) {
      dispatchEquations({
        type: "delete",
        id: equationToDelete,
      });
      setSelectedEquations((prevEq) => {
        return prevEq.filter((eq) => eq.id !== equationToDelete);
      });
    }
    setEquationToDelete(null);
  }, [equationToDelete]);

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
      <AlertComponent
        title="Remover Equação"
        content="Tem certeza que quer remover esta equação?"
        visible={!!equationToDelete}
        confirmText="Remover"
        onConfirm={confirmDelete}
        dismissText="Cancelar"
        onDismiss={() => setEquationToDelete(null)}
      />

      <AlertComponent
        title="Remover Equações"
        content={
          selectedEquations.length > 1
            ? `Tem certeza que quer remover as ${selectedEquations.length} equações selecionadas?`
            : "Tem certeza que quer remover a equação selecionada?"
        }
        visible={!!confirmDeleteMultiples}
        confirmText="Remover"
        onConfirm={deleteselectedEquations}
        dismissText="Cancelar"
        onDismiss={() => setConfirmDeleteMultiples(false)}
      />

      {selectedEquations.length > 0 ? (
        <SelectMultiplesComponent
          allSelected={selectedEquations.length === equations.length}
          handleConfirmDeleteMultiples={handleConfirmDeleteMultiples}
          selectAllItems={selectAllEquations}
          selectedItems={selectedEquations}
          style={{ paddingTop: StatusBar.currentHeight, marginVertical: 4 }}
        />
      ) : (
        <LatexHeader />
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
                      onDrag={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        drag();
                      }}
                      isActive={isActive}
                      onPress={handlePress}
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            }}
            keyExtractor={(file) => file.id}
            onDragEnd={({ data }) => {
              dispatchEquations({ type: "reorder", newOrder: data });
            }}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <NotFoundLatex />
        </View>
      )}
      {selectedEquations.length > 0 && (
        <FAB
          style={[
            styles.cancelFab,
            {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          icon="window-close"
          onPress={() => setSelectedEquations([])}
        />
      )}
      <FABComponent
        style={styles.addFab}
        icon="plus"
        action={() => handleAddLatex()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cancelFab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    zIndex: 999,
  },
  addFab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
