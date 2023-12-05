import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Card, IconButton, Text } from "react-native-paper";
import { ScrollView } from "react-native";

export const CopyTextComponent = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

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
            <Text>{text}</Text>
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
