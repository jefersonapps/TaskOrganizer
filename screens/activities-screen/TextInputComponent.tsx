import { TextInput } from "react-native-paper";
import { View } from "react-native";

type TextInputComponentProps = {
  setText: (value: string) => void;
  text: string;
  label: string;
  noMultiline?: boolean;
};

export const TextInputComponent = ({
  text,
  setText,
  label,
  noMultiline,
}: TextInputComponentProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 10,
        gap: 10,
        alignItems: "center",
        width: "100%",
      }}
    >
      <TextInput
        theme={{ roundness: 20 }}
        contentStyle={{
          marginHorizontal: 0,
        }}
        multiline={noMultiline ? false : true}
        mode="outlined"
        style={{ flex: 1, maxHeight: 200 }}
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
