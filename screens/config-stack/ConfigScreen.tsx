import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext } from "react";
import { View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import {
  Button,
  Divider,
  List,
  Switch,
  Text,
  TouchableRipple,
} from "react-native-paper";

import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInputComponent } from "../activities-screen/TextInputComponent";

type RootStackParamList = {
  Config: undefined;
  Functionalities: undefined;
};

type ConfigScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Config"
>;

type NavigationProps = {
  navigation: ConfigScreenNavigationProp;
};

interface ConfigItemListProps {
  title: string;
  description?: string;
  leftElement: (props: any) => React.ReactNode;
  rightElement: (props: any) => React.ReactNode;
}

const ConfigItemList = ({
  title,
  description,
  leftElement,
  rightElement,
}: ConfigItemListProps) => (
  <List.Item
    title={title}
    description={description}
    left={(props) => leftElement(props)}
    right={(props) => rightElement(props)}
  />
);

export function ConfigScreen({ navigation }: NavigationProps) {
  const { toggleTheme, image, setImage, userName, setUserName } =
    useContext(AppContext);
  const theme = useAppTheme();

  const [isEditingName, setIsEditingName] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <TouchableOpacity
        onPress={pickImage}
        style={{ borderColor: "#34d399", borderWidth: 4, borderRadius: 9999 }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderColor: "#34d399",
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="person"
              size={60}
              color={theme.colors.onPrimaryContainer}
            />
          </View>
        )}
      </TouchableOpacity>

      {isEditingName ? (
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInputComponent
              label="Digite seu nome..."
              setText={setUserName}
              text={userName}
              noMultiline
            />
          </View>

          {/* <TextInput value={name} onChangeText={setName} /> */}
          <Button mode="contained" onPress={() => setIsEditingName(false)}>
            Ok
          </Button>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditingName(true)}>
          <Text
            style={{
              fontSize: 20,
              marginVertical: 14,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            {userName ? userName : "Digite seu nome..."}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableRipple style={{ width: "100%" }} onPress={toggleTheme}>
        <ConfigItemList
          title={"Modo noturno"}
          description={"Ativar/Desativar"}
          leftElement={(props) => (
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={30}
              {...props}
            />
          )}
          rightElement={(props) => (
            <Switch
              value={theme.dark}
              onValueChange={toggleTheme}
              {...props}
              color={theme.colors.primary}
            />
          )}
        />
      </TouchableRipple>

      <Divider style={{ width: "100%" }} />

      <TouchableRipple
        style={{ width: "100%" }}
        onPress={() => navigation.navigate("Functionalities")}
      >
        <ConfigItemList
          title="Funcionalidades e ajuda"
          leftElement={(props) => (
            <MaterialCommunityIcons name="tools" size={30} {...props} />
          )}
          rightElement={(props) => (
            <AntDesign name="right" size={30} {...props} />
          )}
        />
      </TouchableRipple>
    </View>
  );
}
