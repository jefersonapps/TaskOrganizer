import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
} from "react";
import { FlatList, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppContext } from "../../contexts/AppContext";
import { RootStackParamList } from "./ActivitiesStack";

import { Button, Paragraph, Portal, Dialog, FAB } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { CardComponent } from "./CardComponent";

type ActivitiesRoute = RouteProp<RootStackParamList, "EditActivity">;
type ActivitiesNavigation = NativeStackNavigationProp<RootStackParamList>;

export const ActivitiesScreen = memo(() => {
  const route = useRoute<ActivitiesRoute>();
  const navigation = useNavigation<ActivitiesNavigation>();
  const { activities, activitiesDispatch } = useContext(AppContext);

  const [activitieToDelete, setActivitieToDelete] = useState<string | null>(
    null
  );
  const theme = useAppTheme();

  useEffect(() => {
    if (navigation.isFocused() && route.params?.activity) {
      activitiesDispatch({ type: "update", activity: route.params.activity });
    }
  }, [navigation]);

  const handleDelete = useCallback((id: string) => {
    setActivitieToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (activitieToDelete) {
      activitiesDispatch({ type: "delete", id: activitieToDelete });
    }
    setActivitieToDelete(null);
  }, [activitieToDelete]);

  const goToAddActivity = () => {
    navigation.navigate("Add");
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "flex-start",
      }}
    >
      <Portal>
        <Dialog
          visible={!!activitieToDelete}
          onDismiss={() => setActivitieToDelete(null)}
        >
          <Dialog.Title>Remover Atividade</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Tem certeza que quer remover esta atividade?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setActivitieToDelete(null)}>Cancelar</Button>
            <Button onPress={confirmDelete}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <CardComponent item={item} handleDelete={handleDelete} />
        )}
      />

      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        icon="plus"
        onPress={goToAddActivity}
      />
    </View>
  );
});
