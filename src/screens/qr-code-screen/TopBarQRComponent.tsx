import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";

const tabs = ["Scanner", "Criar QR", "Ler imagem"];

interface TopTabsProps {
  setActiveTab: (activeTab: number) => void;
  activeTab: number;
}

export const TopBarQRComponent = ({
  setActiveTab,
  activeTab,
}: TopTabsProps) => {
  const ITEM_WIDTH = 120; // Ajuste este valor conforme necessário
  const translateX = useRef(new Animated.Value(activeTab * ITEM_WIDTH)).current;
  const theme = useAppTheme();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: activeTab * ITEM_WIDTH,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const indicatorStyle = useMemo(() => {
    return {
      transform: [{ translateX }],
      width: ITEM_WIDTH,
    };
  }, [activeTab]);

  return (
    <View>
      <ScrollView horizontal contentContainerStyle={{ height: 35 }}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            activeOpacity={0.6}
            key={index}
            onPress={() => setActiveTab(index)}
            style={{ padding: 5, width: ITEM_WIDTH }}
          >
            <Text
              style={[
                activeTab === index ? styles.activeText : styles.inactiveText,
                {
                  color:
                    activeTab === index
                      ? theme.colors.primary
                      : theme.colors.secondary,
                  fontWeight: "bold",
                  fontSize: 16,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: theme.colors.primary },
          ]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  activeText: { fontWeight: "bold", textAlign: "center" },
  inactiveText: { fontWeight: "normal", textAlign: "center" },
  indicator: { position: "absolute", bottom: 0, height: 2 },
});
