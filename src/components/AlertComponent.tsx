import { ReactNode } from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

interface DeleteActivityAlert {
  visible: boolean;
  onDismiss?: () => void;
  onConfirm?: () => void;
  title: string;
  content: string | ReactNode;
  dismissText?: string;
  confirmText?: string;
}

export const AlertComponent = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  content,
  dismissText,
  confirmText,
}: DeleteActivityAlert) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{ textAlign: "justify" }}>{content}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          {dismissText && onDismiss && (
            <Button onPress={onDismiss}>{dismissText}</Button>
          )}
          {confirmText && onConfirm && (
            <Button onPress={onConfirm}>{confirmText}</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
