import { ScrollView, View, Dimensions, Pressable, Image } from "react-native";
import { Portal, Dialog, Card, IconButton } from "react-native-paper";
import { Button } from "react-native-paper";
import { useRef, useState } from "react";
import { LatexType } from "../../contexts/AppContext";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { MathJaxComponent } from "./MathJaxComponent";
import { SelectedLatexType } from "./LatexScreen";
import { useAppTheme } from "../../theme/Theme";

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

  const isSelected = selectedEquations.some(
    (someFile) => someFile.id === item.id
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
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
        style={{
          margin: 10,
          flex: 1,
          borderWidth: isActive ? 1 : 0,
          borderColor: isActive ? theme.colors.primary : theme.colors.surface,
          backgroundColor: isActive ? theme.colors.surface : undefined,
          borderRadius: 14,
        }}
      >
        <Card.Content>
          <View
            style={{
              height: 250,
              width: "100%",

              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: "white",
            }}
          >
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
