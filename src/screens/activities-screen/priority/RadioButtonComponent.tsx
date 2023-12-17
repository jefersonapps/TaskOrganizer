import { View, TouchableNativeFeedback } from "react-native";
import { RadioButton, Text } from "react-native-paper";

type RadioButtonComponentProps = {
  setPriority: (value: string) => void;
  value: string;
  label: string;
};

export const RadioButtonComponent = ({
  setPriority,
  value,
  label,
}: RadioButtonComponentProps) => {
  return (
    <View
      style={{
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <TouchableNativeFeedback onPress={() => setPriority(value)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 5,
          }}
        >
          <RadioButton value={value} />
          <Text style={{ paddingRight: 10 }}>{label}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
