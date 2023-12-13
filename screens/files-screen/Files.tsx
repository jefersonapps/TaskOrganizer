import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  TouchableNativeFeedback,
  View,
} from "react-native";
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
import * as Sharing from "expo-sharing";
import { AppContext, File } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { ListItem } from "./ListItem";
import LottieView from "lottie-react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useNavigation } from "@react-navigation/native";

interface RenderItemProps {
  item: any; // Substitua YourItemType pelo tipo real do seu item
  drag: () => void;
  isActive: boolean;
}

export type FilesMultipleDelete = {
  id: string;
};

export default function Files() {
  const { files, setFiles } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const navigation = useNavigation();

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

  const handleShareFiles = async (fileUri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(fileUri);
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

  const [selectedFiles, setSelectedFiles] = useState<FilesMultipleDelete[]>([]);

  const handleLongPress = useCallback(
    (id: string) => {
      if (selectedFiles.length === 0) {
        setSelectedFiles([{ id: id }]);
      }
    },
    [selectedFiles]
  );

  const handlePress = useCallback(
    (id: string) => {
      if (selectedFiles.length < 1) return;
      setSelectedFiles((prevselectedFiles) => {
        const activityExists = prevselectedFiles.find(
          (activity) => activity.id === id
        );

        if (activityExists) {
          return prevselectedFiles.filter((activity) => activity.id !== id);
        } else {
          return [...prevselectedFiles, { id: id }];
        }
      });
    },
    [selectedFiles]
  );

  const handleDeleteMultiple = useCallback((files: FilesMultipleDelete[]) => {
    files.forEach((currFile) => {
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== currFile.id)
      );
    });
    setSelectedFiles([]);
  }, []);
  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const deleteselectedFiles = useCallback(() => {
    handleDeleteMultiple(selectedFiles);
    setConfirmDeleteMultiples(false);
  }, [selectedFiles, handleDeleteMultiple]);

  const handleConfirmDeleteMultiples = useCallback(() => {
    setConfirmDeleteMultiples(true);
  }, []);

  const selectAllFiles = useCallback(() => {
    if (files.length === 0) return;
    setSelectedFiles(
      files.map((currFile) => ({
        id: currFile.id,
      }))
    );
  }, [files]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: selectedFiles.length === 0,
    });
  }, [selectedFiles, navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {selectedFiles.length > 0 && (
        <>
          <FAB
            style={{
              position: "absolute",
              margin: 16,
              left: 68,
              bottom: 0,
              zIndex: 999,
              backgroundColor: theme.colors.surfaceVariant,
            }}
            icon="share-variant"
            // onPress={handleShareFiles}
          />

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
            onPress={() => setSelectedFiles([])}
          />
        </>
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

        <Dialog
          visible={!!confirmDeleteMultiples}
          onDismiss={() => setConfirmDeleteMultiples(false)}
        >
          <Dialog.Title>Remover Arquivos</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Tem certeza que quer remover os {selectedFiles.length} arquivos
              selecionados?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDeleteMultiples(false)}>
              Cancelar
            </Button>
            <Button onPress={deleteselectedFiles}>Sim</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {selectedFiles.length > 0 && (
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
              selectedFiles.length === files.length
                ? "circle"
                : "circle-outline"
            }
            mode="outlined"
            onPress={selectAllFiles}
          >
            Todas
          </Button>

          <Button
            mode="contained"
            onPress={handleConfirmDeleteMultiples}
            icon="delete"
          >
            {selectedFiles.length}
          </Button>
        </View>
      )}

      {files.length > 0 ? (
        <View style={{ flex: 1, width: "100%" }}>
          <DraggableFlatList
            contentContainerStyle={{ paddingBottom: 80 }}
            data={files}
            renderItem={({ item: file, drag, isActive }) => {
              return (
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple("gray", false)}
                  // onLongPress={() => handleShareFile(file.uri)}
                  onPress={() => {
                    if (selectedFiles.length === 0) {
                      handleOpenFile(file.uri);
                    }
                  }}
                  onLongPress={() => handleLongPress(file.id)}
                >
                  <View style={{ flex: 1, alignItems: "stretch" }}>
                    <ListItem
                      file={file}
                      onDelete={handleDelete}
                      onDrag={drag}
                      isActive={isActive}
                      onPress={handlePress}
                      selectedFiles={selectedFiles}
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            }}
            keyExtractor={(file) => file.id}
            onDragEnd={({ data }) => setFiles(data)}
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
            source={require("../../lottie-files/files-animation.json")}
          />
        </View>
      )}
    </View>
  );
}
