import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAppTheme } from "../../../theme/Theme";

interface CardWithNumberProps {
  title: string;
  number: number;
}

export const CardWithNumber = ({ title, number }: CardWithNumberProps) => {
  const theme = useAppTheme();
  return (
    <Card
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.secondaryContainer,
        },
      ]}
    >
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <Text
          style={[
            styles.quantity,
            {
              color: theme.colors.primary,
            },
          ]}
        >
          {number}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 14, minWidth: 100 },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  quantity: { fontWeight: "bold", textAlign: "center", fontSize: 40 },
});
