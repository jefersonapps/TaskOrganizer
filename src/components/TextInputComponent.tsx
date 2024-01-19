import React, { useRef } from "react";
import { TextInput as ReactTextInput, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { TextInput } from "react-native-paper";

type TextInputComponentProps = {
  setText: (value: string) => void;
  text: string;
  label: string;
  noMultiline?: boolean;
  maxHeight?: number;
  minHeight?: number;
};

export const TextInputComponent = ({
  text,
  setText,
  label,
  noMultiline,
  maxHeight = 200,
  minHeight = 0,
}: TextInputComponentProps) => {
  const inputRef = useRef<ReactTextInput | null>(null);

  const handleFocus = () => {
    if (inputRef.current?.isFocused()) return;
    if (inputRef.current) {
      inputRef.current.focus();
      console.log(inputRef.current);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleFocus}
      style={styles.container}
    >
      <TextInput
        ref={inputRef}
        theme={{ roundness: 20 }}
        contentStyle={{
          marginHorizontal: 0,
        }}
        multiline={noMultiline ? false : true}
        mode="outlined"
        style={{ flex: 1, maxHeight: maxHeight, minHeight: minHeight }}
        label={label}
        value={text}
        onChangeText={(text) => setText(text)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 10,
    alignItems: "center",
    width: "100%",
  },
});
