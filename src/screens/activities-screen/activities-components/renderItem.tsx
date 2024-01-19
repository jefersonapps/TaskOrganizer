import * as Haptics from "expo-haptics";
import { ActivityType, NotificationIdType } from "../../../contexts/AppContext";
import { ActivityMultipleDelete } from "../ActivitiesScreen";
import { CardComponent } from "./CardComponent";

interface RenderItemProps {
  item: ActivityType;
  selectedActivities: ActivityMultipleDelete[];
  drag: () => void;
  handleDelete: (id: string, identifier: NotificationIdType) => void;
  checkActivity: (id: string, identifier: NotificationIdType) => void;
  handleLongPress: (id: string, identifier: NotificationIdType) => void;
  handlePress: (id: string, identifier: NotificationIdType) => void;
  isActive: boolean;
}

export const renderItem = ({
  item,
  drag,
  isActive,
  handleDelete,
  checkActivity,
  handleLongPress,
  handlePress,
  selectedActivities,
}: RenderItemProps) => {
  return (
    <CardComponent
      item={item}
      handleDelete={handleDelete}
      checkActivity={checkActivity}
      isActive={isActive}
      onDrag={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        drag();
      }}
      onLongPress={handleLongPress}
      onPress={handlePress}
      selectedActivities={selectedActivities}
    />
  );
};
