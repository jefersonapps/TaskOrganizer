import React, { useCallback, useContext, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Button,
  Divider,
  Dialog,
  Portal,
  Paragraph,
  FAB,
} from "react-native-paper";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Crypto from "expo-crypto";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { ListItem } from "./ListItem";
import LottieView from "lottie-react-native";

export default function Files() {
  const { files, setFiles } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const theme = useAppTheme();

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setFiles([
        ...files,
        {
          id: Crypto.randomUUID(),
          name: result.assets[0].name,
          uri: result.assets[0].uri,
        },
      ]);
    }
  };

  const handleOpenFile = async (fileUri: string) => {
    try {
      const cUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
      });
    } catch (error) {
      setVisible(true);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setFileToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileToDelete)
    );
    setFileToDelete(null);
  }, [fileToDelete]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        icon="plus"
        onPress={pickDocument}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Não foi possível abrir o arquivo</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Parece que você não tem um aplicativo capaz de abrir este tipo de
              arquivo. Por favor, baixe um aplicativo compatível e tente
              novamente.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={!!fileToDelete}
          onDismiss={() => setFileToDelete(null)}
        >
          <Dialog.Title>Remover arquivo</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Tem certeza que quer remover este arquivo da lista?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFileToDelete(null)}>Cancelar</Button>
            <Button onPress={confirmDelete}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {files.length > 0 ? (
        <FlatList
          data={files}
          keyExtractor={(file) => file.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item: file }) => (
            <View style={{ flex: 1, alignItems: "stretch" }}>
              {ListItem({
                file: file,
                onDelete: handleDelete,
                onOpenFile: handleOpenFile,
              })}
            </View>
          )}
          style={{ margin: 0, padding: 0, width: "100%" }}
          ItemSeparatorComponent={Divider}
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
            source={require("../../lottie-files/files-animation.json")}
          />
        </View>
      )}
    </View>
  );
}
