import { List } from "react-native-paper";

interface ConfigItemListProps {
  title: string;
  description?: string;
  leftElement: (props: any) => React.ReactNode;
  rightElement?: (props: any) => React.ReactNode;
}

export const ConfigItemList = ({
  title,
  description,
  leftElement,
  rightElement,
}: ConfigItemListProps) => (
  <List.Item
    title={title}
    description={description}
    left={(props) => leftElement(props)}
    right={(props) => (rightElement ? rightElement(props) : undefined)}
  />
);
