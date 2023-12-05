import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

interface CustomAlertProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  title: string;
  content: string;
}
export const CustomAlert = ({
  isVisible,
  setIsVisible,
  title,
  content,
}: CustomAlertProps) => {
  return (
    <Portal>
      <Dialog visible={!!isVisible} onDismiss={() => setIsVisible(false)}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{content}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsVisible(false)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
