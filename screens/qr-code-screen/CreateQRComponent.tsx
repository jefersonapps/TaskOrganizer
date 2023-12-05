import React, { SetStateAction } from "react";
import { ScrollView, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SvgQRCode from "react-native-qrcode-svg";
import { Button, Text } from "react-native-paper";
import { TextInputComponent } from "../activities-screen/TextInputComponent";
import { useAppTheme } from "../../theme/Theme";
import LottieView from "lottie-react-native";

interface CreateQRComponentProps {
  viewShotRef: React.MutableRefObject<null>;
  inputText: string;
  setInputText: React.Dispatch<SetStateAction<string>>;
  handleDownloadQRCode: () => Promise<void>;
  handleShareQRCode: () => Promise<void>;
}

export const CreateQRComponent = ({
  viewShotRef,
  inputText,
  setInputText,
  handleDownloadQRCode,
  handleShareQRCode,
}: CreateQRComponentProps) => {
  const theme = useAppTheme();
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", paddingTop: 14 }}>
        <View
          style={{ padding: 10, backgroundColor: "white", borderRadius: 10 }}
          ref={viewShotRef}
        >
          <SvgQRCode value={inputText || "Digite algo..."} size={160} />
        </View>
        <View style={{ flexDirection: "row", paddingTop: 14, gap: 14 }}>
          <Button
            mode="contained"
            onPress={handleDownloadQRCode}
            style={{
              backgroundColor: theme.colors.primaryContainer,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="download"
              size={20}
              color={theme.colors.onPrimaryContainer}
            />
            <Text style={{ color: theme.colors.onPrimaryContainer }}>
              {" "}
              &nbsp;Baixar
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={handleShareQRCode}
            style={{
              backgroundColor: theme.colors.primaryContainer,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="sharealt"
              size={20}
              color={theme.colors.onPrimaryContainer}
            />
            <Text
              style={{
                color: theme.colors.onPrimaryContainer,
                marginLeft: 2,
              }}
            >
              {" "}
              &nbsp;Enviar
            </Text>
          </Button>
        </View>
        <View style={{ margin: 15 }}>
          <View style={{ marginTop: "auto", width: "100%" }}>
            <TextInputComponent
              label="Digite um link ou texto..."
              setText={setInputText}
              text={inputText}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
