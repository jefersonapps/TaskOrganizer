import React from "react";
import { View, Image, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";
import { CopyTextComponent } from "./CopyTextComponent";
import LottieView from "lottie-react-native";

interface ReadQRTabProps {
  DecodeImage: () => void;
  selectedImage: string | null;
  code: string;
  link: string;
  handleVisitSite: () => void;
  isValidURL: (link: string) => boolean;
}
export const ReadQRTab = ({
  DecodeImage,
  selectedImage,
  code,
  link,
  handleVisitSite,
  isValidURL,
}: ReadQRTabProps) => {
  const theme = useAppTheme();

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 14,
        }}
      >
        <Button
          mode="contained"
          onPress={DecodeImage}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="picture"
            size={20}
            color={theme.colors.onPrimaryContainer}
          />
          <Text style={{ color: theme.colors.onPrimaryContainer }}>
            &nbsp;&nbsp;Escolher imagem
          </Text>
        </Button>
        {selectedImage && (
          <View
            style={{
              borderRadius: 10,
              overflow: "hidden",
              marginVertical: 14,
              padding: 10,
              backgroundColor: "white",
            }}
          >
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 160, height: 160 }}
            />
          </View>
        )}
        {!selectedImage && (
          <AntDesign name="qrcode" size={160} color={"rgb(51, 65, 85)"} />
        )}
        {code && <CopyTextComponent text={code} />}
        {link && <CopyTextComponent text={link} />}
        {isValidURL(link) && (
          <Button
            mode="contained"
            style={{ marginTop: 14 }}
            onPress={handleVisitSite}
          >
            Visitar site
          </Button>
        )}
      </View>
    </ScrollView>
  );
};
