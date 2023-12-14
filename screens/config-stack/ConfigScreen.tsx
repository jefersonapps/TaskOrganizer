import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { useAppTheme } from "../../theme/Theme";
import {
  Button,
  Card,
  Dialog,
  Divider,
  List,
  Portal,
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
import { useMediaLibraryPermission } from "../../Hooks/usePermission";
import { GetPermission } from "../../components/GetPermission";
import { ScheduleChart } from "../../components/ScheduleChart";
import * as LocalAuthentication from "expo-local-authentication";

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

const CardWithNumber = ({
  title,
  number,
}: {
  title: string;
  number: number;
}) => {
  const theme = useAppTheme();
  return (
    <Card
      style={{
        backgroundColor: theme.colors.secondaryContainer,
        marginTop: 14,
      }}
    >
      <Card.Content>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 40,
            textAlign: "center",
            color: theme.colors.primary,
          }}
        >
          {number}
        </Text>
      </Card.Content>
    </Card>
  );
};

export function ConfigScreen({ navigation }: NavigationProps) {
  const {
    toggleTheme,
    image,
    setImage,
    userName,
    setUserName,
    activities,
    schedule,
    isBiometricEnabled,
    setIsBiometricEnabled,
  } = useContext(AppContext);
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

  const totalActivities = useMemo(() => {
    return activities.length;
  }, [activities]);

  const checkedActivitiesSize = useMemo(() => {
    return activities.filter((activity) => activity.checked).length;
  }, [activities]);

  const withDeadlineActivitiesSize = useMemo(() => {
    return activities.filter((activity) => activity.deliveryDay).length;
  }, [activities]);

  const [isCompatibleAlertVisible, setIsCompatibleAlertVisible] =
    useState(false);

  const [isNoBiometryAlertVisible, setIsNoBiometryAlertVisible] =
    useState(false);

  const enableBiometrics = async () => {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirme sua identidade para ativar",
      fallbackLabel: "Não foi possível desbloquear, tente novamente",
    });
    if (auth.success) {
      setIsBiometricEnabled(true);
    }
  };

  const toggleBiometricSecurity = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      setIsCompatibleAlertVisible(true);
    }

    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isBiometricEnrolled && compatible && !isBiometricEnabled) {
      console.log("Nenhuma biometria cadastrada");
      setIsNoBiometryAlertVisible(true);
      return;
    }

    if (!isBiometricEnabled) {
      enableBiometrics();
    }

    if (isBiometricEnabled) {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirme sua identidade para desativar",
        fallbackLabel: "Não foi possível desbloquear, tente novamente",
      });

      if (auth.success) {
        setIsBiometricEnabled(false);
      }
    }
  };

  const { mediaLibraryPermission, requestMediaLibraryPermission } =
    useMediaLibraryPermission();

  if (mediaLibraryPermission === "denied") {
    return (
      <GetPermission
        getPermissionAfterSetInConfigs={requestMediaLibraryPermission}
        title="A galeria não está disponível"
        content="Desculpe, parece que não conseguimos acessar a galeria do seu dispositivo. 
    Por favor, verifique as configurações de permissão de acesso a fotos e vídeos 
    e tente novamente."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          justifyContent: "flex-start",
          paddingVertical: 14,
        }}
      >
        <Portal>
          <Dialog
            visible={isCompatibleAlertVisible}
            onDismiss={() => setIsCompatibleAlertVisible(false)}
          >
            <Dialog.Title>Biometria não suportada</Dialog.Title>
            <Dialog.Content>
              <Text style={{ textAlign: "justify" }}>
                Biometria não é suportada no seu dispositivo. Você usará sua
                senha padrão.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setIsCompatibleAlertVisible(false);
                  setIsBiometricEnabled(true);
                }}
              >
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog
            visible={isNoBiometryAlertVisible}
            onDismiss={() => setIsNoBiometryAlertVisible(false)}
          >
            <Dialog.Title>Nenhuma biometria encontrada</Dialog.Title>
            <Dialog.Content>
              <Text style={{ textAlign: "justify" }}>
                Parace que você não tem nenhuma biometria cadastrada no seu
                dispositivo, por favor cadastre e tente novamente, ou clique em{" "}
                <Text
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  Usar senha padrão
                </Text>{" "}
                para utilizar a senha cadastrada no celular ou, se não hover,
                não utilizar sistemas de segurança.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  enableBiometrics();
                  setIsNoBiometryAlertVisible(false);
                }}
              >
                Usar senha padrão
              </Button>
              <Button
                onPress={() => {
                  setIsNoBiometryAlertVisible(false);
                }}
              >
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

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

        <Divider style={{ width: "100%" }} />

        <View style={{ padding: 14, width: "100%" }}>
          <Card style={{ width: "100%" }}>
            <Card.Content>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Relatório de Atividades
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  textAlign: "justify",
                }}
              >
                Confira a quantidade total de atividades em cada modalidade
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      flexDirection: "row",
                      gap: 14,
                    }}
                  >
                    <CardWithNumber title="Total" number={totalActivities} />
                    <CardWithNumber
                      title="A fazer"
                      number={totalActivities - checkedActivitiesSize}
                    />
                    <CardWithNumber
                      title="Feitas"
                      number={checkedActivitiesSize}
                    />
                    <CardWithNumber
                      title="Prazo"
                      number={withDeadlineActivitiesSize}
                    />
                  </ScrollView>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={{ padding: 14, width: "100%" }}>
          <Card style={{ width: "100%" }}>
            <Card.Content>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Relatório da agenda
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  textAlign: "justify",
                }}
              >
                Confira a quantidade total de atividades em cada dia
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 14,
                }}
              >
                <View>
                  <ScheduleChart data={schedule} />
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <Divider style={{ width: "100%" }} />
        <TouchableRipple style={{ width: "100%" }} onPress={toggleTheme}>
          <ConfigItemList
            title={"Modo noturno"}
            description={"Ativar/Desativar"}
            leftElement={(props) => (
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={30}
                  {...props}
                />
              </View>
            )}
            rightElement={(props) => (
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Switch
                  value={theme.dark}
                  onValueChange={toggleTheme}
                  {...props}
                  color={theme.colors.primary}
                />
              </View>
            )}
          />
        </TouchableRipple>

        <Divider style={{ width: "100%" }} />
        <TouchableRipple
          style={{ width: "100%" }}
          onPress={toggleBiometricSecurity}
        >
          <ConfigItemList
            title={"Habilitar Segurança"}
            description={"Ativar/Desativar desbloqueio do app"}
            leftElement={(props) => (
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={30}
                  {...props}
                />
              </View>
            )}
            rightElement={(props) => (
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={toggleBiometricSecurity}
                  {...props}
                  color={theme.colors.primary}
                />
              </View>
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
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons name="tools" size={30} {...props} />
              </View>
            )}
            rightElement={(props) => (
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="right" size={30} {...props} />
              </View>
            )}
          />
        </TouchableRipple>
      </View>
    </ScrollView>
  );
}
