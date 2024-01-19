import { Image, ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { Scan } from "../../../contexts/AppContext";
import { CopyTextComponent } from "./CopyTextComponent";

interface RecentScans {
  recentScans: Scan[];
  setConfirmClearHistory: (value: boolean) => void;
}

export const RecentScans = ({
  recentScans,
  setConfirmClearHistory,
}: RecentScans) => {
  return (
    <Card style={{ width: "100%" }}>
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Histórico</Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 14, textAlign: "justify" }}
            >
              Aqui estão suas leituras recentes
            </Text>
          </View>
          <IconButton
            icon="broom"
            mode="contained"
            disabled={recentScans.length === 0}
            style={{ marginRight: -4 }}
            onPress={() => {
              setConfirmClearHistory(true);
            }}
          />
        </View>

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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                gap: 14,
                padding: 4,
              }}
            >
              {recentScans.length > 0 ? (
                recentScans.map((scan, index) => (
                  <Card key={index} style={{ width: 160 }}>
                    <Image
                      source={{ uri: scan.imageUri ?? undefined }}
                      style={{ width: 160, height: 160, borderRadius: 8 }}
                    />

                    <CopyTextComponent text={scan.content} validateLink />
                  </Card>
                ))
              ) : (
                <View
                  style={{
                    height: 160,
                    width: 160,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>Nenhum código QR foi lido recentemente...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
