import { useContext, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { MyDarkTheme, MyLightTheme, useAppTheme } from "../../theme/Theme";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Switch,
  Text,
  TouchableRipple,
} from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ScheduleChart } from "../../components/ScheduleChart";
import * as LocalAuthentication from "expo-local-authentication";
import { formatName, handleVisitSite } from "../../helpers/helperFunctions";
import { CustomAlert } from "../../components/CustomAlert";
import { UserNameSection } from "./UserNameSection";
import { UserProfileImage } from "./UserProfileImage";
import { ConfigItemList } from "./ConfigItemList";
import { CardWithNumber } from "./CardWithNumber";
import { MMKV } from "react-native-mmkv";
import { useIsFocused } from "@react-navigation/native";
export const storage = new MMKV();
export const loadState = <T extends unknown>(key: string): T | undefined => {
  const state = storage.getString(key);
  return state ? (JSON.parse(state) as T) : undefined;
};

export function ConfigScreen() {
  const {
    image,
    setImage,
    userName,
    setUserName,
    activities,
    schedule,
    isBiometricEnabled,
    setIsBiometricEnabled,
    setTheme,
  } = useContext(AppContext);
  const theme = useAppTheme();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedUserName, setEditedUserName] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
  const [isThemeChanged, setIsThemeChanged] = useState(false);

  const toggleThemeOfApp = () => {
    setIsDarkTheme((prev) => !prev);
    setIsThemeChanged(true);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isThemeChanged && !isFocused) {
      console.log("desativou");
      setIsThemeChanged(false);
    }
  }, [isFocused, isThemeChanged]);

  useEffect(() => {
    if (isThemeChanged) {
      console.log("chamou");
      setTheme(isDarkTheme ? MyDarkTheme : MyLightTheme);
    }
  }, [isDarkTheme, isThemeChanged]);

  const [imagePickerStatus, requestImagePickerPermission] =
    ImagePicker.useCameraPermissions();

  const pickImage = async () => {
    if (!imagePickerStatus?.granted) {
      requestImagePickerPermission();
    }
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
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible && !isBiometricEnabled) {
        setIsCompatibleAlertVisible(true);
        return;
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
        console.log(auth);

        if (auth.success) {
          setIsBiometricEnabled(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

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
        <CustomAlert
          title="Biometria não suportada"
          content="Biometria não é suportada no seu dispositivo. Você usará sua senha padrão."
          isVisible={isCompatibleAlertVisible}
          setIsVisible={() => {
            enableBiometrics();
            setIsCompatibleAlertVisible(false);
          }}
        />

        <CustomAlert
          title="Nenhuma biometria encontrada"
          content={
            <Text style={{ textAlign: "justify" }}>
              Parace que você não tem nenhuma biometria cadastrada no seu
              dispositivo, por favor cadastre e tente novamente, ou clique em{" "}
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Usar senha padrão
              </Text>{" "}
              para utilizar a senha cadastrada no celular ou, se não hover, não
              utilizar sistemas de segurança.
            </Text>
          }
          isVisible={isNoBiometryAlertVisible}
          setIsVisible={setIsNoBiometryAlertVisible}
          leftButton={
            <Button
              onPress={() => {
                enableBiometrics();
                setIsNoBiometryAlertVisible(false);
              }}
            >
              Usar senha padrão
            </Button>
          }
        />

        <UserProfileImage image={image} onPress={pickImage} />

        <UserNameSection
          savedUserName={userName}
          userName={editedUserName}
          isEditing={isEditingName}
          onChangeText={setEditedUserName}
          onPressToOpenEditInput={() => setIsEditingName(true)}
          onPressToUpdateName={() => {
            setUserName(formatName(editedUserName));
            setEditedUserName(formatName(editedUserName));
            setIsEditingName(false);
          }}
        />

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
        <TouchableRipple style={{ width: "100%" }} onPress={toggleThemeOfApp}>
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
                  value={isDarkTheme}
                  onValueChange={toggleThemeOfApp}
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

        <View style={{ width: "100%" }}>
          <ConfigItemList
            title={"Dica"}
            description={"Insira widgets do TaskOrganizer na sua tela inicial."}
            leftElement={(props) => (
              <View
                style={{
                  paddingLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton icon="tooltip" />
              </View>
            )}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 14,
          }}
        >
          <Text>from</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleVisitSite("https://github.com/jefersonapps")}
          >
            <Text style={{ color: theme.colors.primary }}>Jeferson Leite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
