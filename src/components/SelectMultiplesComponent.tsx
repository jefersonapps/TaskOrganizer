import { StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

interface SelectMultiplesComponent {
  selectedItems: any[];
  allSelected: boolean;
  selectAllItems: () => void;
  handleConfirmDeleteMultiples: () => void;
  style?: ViewStyle;
}
export const SelectMultiplesComponent = ({
  selectedItems,
  allSelected,
  selectAllItems,
  handleConfirmDeleteMultiples,
  style,
}: SelectMultiplesComponent) => {
  return (
    <View
      style={{
        ...styles.container,
        ...style,
      }}
    >
      <Button
        style={{ marginRight: 14 }}
        icon={allSelected ? "circle" : "circle-outline"}
        mode="outlined"
        onPress={selectAllItems}
      >
        Todas
      </Button>

      <Button
        mode="contained"
        onPress={handleConfirmDeleteMultiples}
        icon="delete"
      >
        {selectedItems.length}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
    paddingHorizontal: 14,
  },
});
