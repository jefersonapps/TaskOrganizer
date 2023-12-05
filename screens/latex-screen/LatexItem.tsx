import MathJax from "react-native-mathjax";
import { ScrollView, View, Dimensions } from "react-native";
import { Portal, Dialog, Card, IconButton } from "react-native-paper";
import { mmlOptions } from "../../constants/constants";
import { Button } from "react-native-paper";
import { useRef, useState } from "react";
import { LatexType } from "../../contexts/AppContext";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

interface LatexItemProps {
  item: LatexType;
  handleAddLatex: () => void;
  handleDeleteEquation: (id: string) => void;
}

export const LatexItem = ({
  item,
  handleAddLatex,
  handleDeleteEquation,
}: LatexItemProps) => {
  const newMmlOptions = { ...mmlOptions, showMathMenu: false };
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
    console.log(localUri);
  };

  return (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <View style={{ height: 250, pointerEvents: "none" }}>
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
            <View>
              <MathJax
                html={`<div><br> ${item.code} <br> <br> <br> <div>`}
                mathJaxOptions={newMmlOptions}
              />
            </View>
          </ScrollView>
        </View>
      </Card.Content>
      <Card.Actions>
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
                <View style={{ padding: 2 }} ref={codeRef} collapsable={false}>
                  <MathJax
                    html={`<div><br> ${item.code} <br> <br> <br> <div>`}
                    mathJaxOptions={mmlOptions}
                  />
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
  );
};
