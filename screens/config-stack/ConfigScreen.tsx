import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext } from "react";
import { View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import { Divider, List, Switch, TouchableRipple } from "react-native-paper";

import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

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
  const { toggleTheme } = useContext(AppContext);
  const theme = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
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
