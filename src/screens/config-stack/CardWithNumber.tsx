import { Card, Text } from "react-native-paper";
import { useAppTheme } from "../../theme/Theme";

export const CardWithNumber = ({
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
