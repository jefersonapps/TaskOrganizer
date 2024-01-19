import { View } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
} from "reanimated-color-picker";

export const PickColor = ({
  showPickColor,
  setShowPickColor,
  setColor,
  color = "blue",
}: any) => {
  return (
    <Portal>
      <Dialog
        visible={!!showPickColor}
        onDismiss={() => setShowPickColor(false)}
      >
        <Dialog.Title>Escolha uma cor</Dialog.Title>
        <Dialog.Content>
          <View>
            <ColorPicker
              style={{ gap: 14 }}
              value={color}
              onComplete={({ hex }) => setColor(hex)}
            >
              <Panel1 style={{ height: 160 }} />
              <HueSlider style={{ height: 50 }} />
              <OpacitySlider style={{ height: 50 }} />
            </ColorPicker>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowPickColor(null)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
