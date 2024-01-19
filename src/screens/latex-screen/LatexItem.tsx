import * as Sharing from "expo-sharing";
import { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Dialog, IconButton, Portal } from "react-native-paper";
import { captureRef } from "react-native-view-shot";
import { LatexType } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { SelectedLatexType } from "./LatexScreen";
import { MathJaxComponent } from "./MathJaxComponent";

interface LatexItemProps {
  item: LatexType;
  handleAddLatex: () => void;
  handleDeleteEquation: (id: string) => void;
  selectedEquations: SelectedLatexType[];
  onDrag: () => void;
  isActive: boolean;
  onPress: (id: string) => void;
}

export const LatexItem = ({
  item,
  handleAddLatex,
  handleDeleteEquation,
  selectedEquations,
  onDrag,
  onPress,
  isActive,
}: LatexItemProps) => {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);

  const { height } = Dimensions.get("window");

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const codeRef = useRef(null);

  const getImageOfCode = async () => {
    if (!codeRef.current) return;
    const localUri = await captureRef(codeRef, {
      height: 440,
      quality: 1,
    });
    Sharing.shareAsync(localUri);
  };

  const isSelected = useMemo(
    () => selectedEquations.some((someFile) => someFile.id === item.id),
    [selectedEquations]
  );

  return (
    <View style={styles.container}>
      {selectedEquations.length > 0 && (
        <IconButton
          icon={isSelected ? "check" : "circle-outline"}
          mode={isSelected ? "contained" : "outlined"}
          onPress={() => {
            onPress(item.id);
          }}
          style={{ marginLeft: 14 }}
        />
      )}
      <Card
        style={[
          styles.cardContainer,
          {
            borderWidth: isActive ? 1 : 0,
            borderColor: isActive ? theme.colors.primary : theme.colors.surface,
            backgroundColor: theme.colors.surface,
            borderTopWidth: theme.dark ? 1 : 0,
            borderTopColor: theme.dark ? "white" : undefined,
            borderBottomWidth: theme.dark ? 1 : 0,
            borderBottomColor: theme.dark ? "#4d4b4b" : undefined,
            borderRightWidth: theme.dark ? 1 : 0,
            borderRightColor: theme.dark ? "#4d4b4b" : undefined,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.cardContent}>
            <Image
              source={{ uri: item.uri }}
              height={240}
              style={{ width: "100%" }}
              resizeMode="cover"
            />
          </View>
        </Card.Content>
        <Card.Actions>
          <Pressable onLongPress={onDrag}>
            <IconButton icon="drag" mode="contained" />
          </Pressable>
          <IconButton icon="pencil" onPress={handleAddLatex} />
          <IconButton icon="arrow-expand" onPress={showDialog} />
          <IconButton
            icon="delete"
            onPress={() => handleDeleteEquation(item.id)}
          />
        </Card.Actions>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Conteúdo LaTeX</Dialog.Title>
            <Dialog.Content>
              <View
                style={{
                  height: height - 250,
                }}
              >
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollViewContainer}
                >
                  <View
                    style={{ padding: 2 }}
                    ref={codeRef}
                    collapsable={false}
                  >
                    <MathJaxComponent latex={item.code} />
                  </View>
                </ScrollView>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={getImageOfCode}>Compartilhar</Button>
              <Button onPress={hideDialog}>Fechar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContainer: {
    margin: 10,
    flex: 1,
    borderRadius: 14,
  },
  cardContent: {
    height: 250,
    width: "100%",

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "white",
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
