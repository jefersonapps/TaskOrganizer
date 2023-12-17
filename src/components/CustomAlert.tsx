import React, { ReactNode } from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

interface CustomAlertProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  title: string;
  content: string | ReactNode;
  leftButton?: ReactNode;
}

export const CustomAlert = ({
  isVisible,
  setIsVisible,
  title,
  content,
  leftButton,
}: CustomAlertProps) => {
  return (
    <Portal>
      <Dialog visible={!!isVisible} onDismiss={() => setIsVisible(false)}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{ textAlign: "justify" }}>{content}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          {leftButton && <React.Fragment>{leftButton}</React.Fragment>}
          <Button onPress={() => setIsVisible(false)}>
            &nbsp;&nbsp;&nbsp;Ok&nbsp;&nbsp;&nbsp;
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
