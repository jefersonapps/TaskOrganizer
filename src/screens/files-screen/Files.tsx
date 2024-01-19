import React, { useCallback, useContext, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Divider, FAB } from "react-native-paper";

import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as IntentLauncher from "expo-intent-launcher";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useSharedValue } from "react-native-reanimated";
import Share, { ShareOptions } from "react-native-share";
import { AlertComponent } from "../../components/AlertComponent";
import { FABComponent } from "../../components/FABComponent";
import { SelectMultiplesComponent } from "../../components/SelectMultiplesComponent";
import { AppContext, File } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { ListItem } from "./ListItem";
import { FilesHeader } from "./files-components/FilesHeader";
import { FilesSearchBarComponent } from "./files-components/FilesSearchBarComponent";
import { NotFoundFile } from "./files-components/NotFoundFile";

export type FilesMultipleDelete = {
  id: string;
  uri: string;
};

export default function Files() {
  const { files, setFiles } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FilesMultipleDelete[]>([]);
  const [confirmDeleteMultiples, setConfirmDeleteMultiples] = useState(false);

  const searchHeight = useSharedValue(0);

  const DEFATULT_SEARCH_HEIGHT = 52;

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
    setSelectedFiles((prevFiles) => {
      return prevFiles.filter((activity) => activity.id !== fileToDelete);
    });
    setFileToDelete(null);
  }, [fileToDelete]);

  const handleLongPress = useCallback(
    (id: string, uri: string) => {
      if (selectedFiles.length === 0) {
        setSelectedFiles([{ id: id, uri: uri }]);
        setIsSearchOpen(false);
      }
    },
    [selectedFiles]
  );

  const handlePress = useCallback(
    (id: string, uri: string) => {
      if (selectedFiles.length < 1) return;
      setSelectedFiles((prevselectedFiles) => {
        const activityExists = prevselectedFiles.find(
          (activity) => activity.id === id
        );

        if (activityExists) {
          return prevselectedFiles.filter((activity) => activity.id !== id);
        } else {
          return [...prevselectedFiles, { id: id, uri: uri }];
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
    setSearchQuery("");
  }, []);

  const deleteselectedFiles = useCallback(() => {
    handleDeleteMultiple(selectedFiles);
    setConfirmDeleteMultiples(false);
    setSearchQuery("");
  }, [selectedFiles, handleDeleteMultiple]);

  const handleConfirmDeleteMultiples = useCallback(() => {
    setConfirmDeleteMultiples(true);
  }, []);

  const selectAllFiles = useCallback(() => {
    if (files.length === 0) return;
    setSelectedFiles(
      files.map((currFile) => ({
        id: currFile.id,
        uri: currFile.uri,
      }))
    );
  }, [files]);

  const shareFiles = async (selectedFiles: FilesMultipleDelete[]) => {
    const fileUris = selectedFiles.map((file) => file.uri);

    const options: ShareOptions = {
      urls: fileUris,
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.log("Error sharing files: ", error);
    }
  };

  const filterFiles = useCallback((files: File[], query: string) => {
    if (!query) {
      return files;
    }

    const normalizedQuery = query.toLowerCase();
    return files.filter((file) =>
      file.name.toLowerCase().includes(normalizedQuery)
    );
  }, []);

  const filteredFiles = filterFiles(files, searchQuery);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AlertComponent
        content="Parece que você não tem um aplicativo capaz de abrir este tipo de
      arquivo. Por favor, baixe um aplicativo compatível e tente
      novamente."
        title="Não foi possível abrir o arquivo"
        visible={visible}
        confirmText="Entendi"
        onConfirm={() => setVisible(false)}
      />

      <AlertComponent
        content="Tem certeza que quer remover este arquivo da lista?"
        title="Remover arquivo"
        visible={!!fileToDelete}
        dismissText="Cancelar"
        onDismiss={() => setFileToDelete(null)}
        confirmText="Remover"
        onConfirm={confirmDelete}
      />

      <AlertComponent
        content={
          selectedFiles.length > 1
            ? `Tem certeza que quer remover os ${selectedFiles.length} arquivos selecionados?`
            : "Tem certeza que quer remover o arquivo selecionado?"
        }
        title="Remover Arquivos"
        visible={!!confirmDeleteMultiples}
        confirmText="Remover"
        onConfirm={deleteselectedFiles}
        dismissText="Cancelar"
        onDismiss={() => setConfirmDeleteMultiples(false)}
      />

      {selectedFiles.length > 0 ? (
        <SelectMultiplesComponent
          allSelected={selectedFiles.length === files.length}
          handleConfirmDeleteMultiples={handleConfirmDeleteMultiples}
          selectAllItems={selectAllFiles}
          selectedItems={selectedFiles}
          style={{ paddingTop: StatusBar.currentHeight, marginVertical: 4 }}
        />
      ) : (
        <FilesHeader
          DEFAULT_SEARCH_HEIGHT={DEFATULT_SEARCH_HEIGHT}
          isSearchOpen={isSearchOpen}
          searchHeight={searchHeight}
          setIsSearchOpen={setIsSearchOpen}
        />
      )}

      {isSearchOpen && (
        <FilesSearchBarComponent
          setIsSearchOpen={setIsSearchOpen}
          DEFAULT_SEARCH_HEIGHT={DEFATULT_SEARCH_HEIGHT}
          searchHeight={searchHeight}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
      )}

      {filteredFiles.length > 0 ? (
        <View style={{ flex: 1, width: "100%" }}>
          <DraggableFlatList
            contentContainerStyle={{ paddingBottom: 80 }}
            data={filteredFiles}
            ItemSeparatorComponent={() => <Divider style={{ width: "100%" }} />}
            renderItem={({ item: file, drag, isActive }) => {
              return (
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "#807e7e15",
                    false
                  )}
                  onPress={() => {
                    if (selectedFiles.length === 0) {
                      handleOpenFile(file.uri);
                    } else {
                      handlePress(file.id, file.uri);
                    }
                  }}
                  onLongPress={() => handleLongPress(file.id, file.uri)}
                >
                  <View style={{ flex: 1, alignItems: "stretch" }}>
                    <ListItem
                      file={file}
                      onDelete={handleDelete}
                      onDrag={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        drag();
                      }}
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
        <NotFoundFile />
      )}

      {selectedFiles.length > 0 && (
        <>
          <FAB
            style={[
              styles.shareFab,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            icon="share-variant"
            onPress={() => shareFiles(selectedFiles)}
          />

          <FAB
            style={[
              styles.cancelFab,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            icon="window-close"
            onPress={() => setSelectedFiles([])}
          />
        </>
      )}
      <FABComponent style={styles.addFab} icon="plus" action={pickDocument} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "flex-start",
  },
  shareFab: {
    position: "absolute",
    margin: 16,
    left: 68,
    bottom: 0,
    zIndex: 999,
  },
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
