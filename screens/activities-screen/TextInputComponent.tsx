import { TextInput } from "react-native-paper";
import { View } from "react-native";

type TextInputComponentProps = {
  setText: (value: string) => void;
  text: string;
  label: string;
};

export const TextInputComponent = ({
  text,
  setText,
  label,
}: TextInputComponentProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 10,
        gap: 10,
        alignItems: "center",
      }}
    >
      <TextInput
        theme={{ roundness: 20 }}
        contentStyle={{
          marginHorizontal: 0,
        }}
        multiline
        mode="outlined"
        style={{ flex: 1 }}
        label={label}
        value={text}
        onChangeText={(text) => setText(text)}
        // right={
        //   <TextInput.Icon
        //     icon="attachment"
        //     style={{ marginBottom: 0 }}
        //     onPress={() => console.log("add file")}
        //   />
        // }
      />
    </View>
  );
};
