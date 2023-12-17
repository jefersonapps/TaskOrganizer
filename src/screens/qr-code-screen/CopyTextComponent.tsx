import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Card, IconButton, Text } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native";
import { handleVisitSite, isValidURL } from "../../helpers/helperFunctions";
import { useAppTheme } from "../../theme/Theme";

interface CopyTextComponentProps {
  text: string;
  validateLink?: boolean;
  numberOfLines?: number;
}

export const CopyTextComponent = ({
  text,
  validateLink,
  numberOfLines,
}: CopyTextComponentProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const theme = useAppTheme();

  const copyToClipboard = async (text: string) => {
    setIsCopied(true);
    await Clipboard.setStringAsync(text);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <Card style={{ margin: 0, maxHeight: 200, maxWidth: "100%" }}>
        <Card.Content
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ScrollView>
            {validateLink && isValidURL(text) ? (
              <TouchableOpacity onPress={() => handleVisitSite(text)}>
                <Text
                  numberOfLines={numberOfLines ?? 2}
                  ellipsizeMode="tail"
                  style={{
                    color: theme.colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  {text}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text numberOfLines={numberOfLines ?? 2} ellipsizeMode="tail">
                {text}
              </Text>
            )}
          </ScrollView>
          <IconButton
            style={{ marginRight: -10 }}
            iconColor={isCopied ? "#34d399" : undefined}
            icon="content-copy"
            onPress={() => copyToClipboard(text)}
          />
        </Card.Content>
      </Card>
    </>
  );
};
