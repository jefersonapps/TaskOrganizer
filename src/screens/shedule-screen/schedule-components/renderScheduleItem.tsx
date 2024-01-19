import * as Haptics from "expo-haptics";
import { SheduleActivityType } from "../../../contexts/AppContext";
import { SheduleCard } from "./SheduleCard";

interface RenderItemProps {
  item: SheduleActivityType;
  drag: () => void;
  isActive: boolean;
  day: string;
  swipeDirection: string;
  handleDelete: any;
  handleUpdate: any;
  handleLongPress: any;
  handlePress: any;
  selectedSchedulesActivities: any;
}

export const renderScheduleItem = ({
  item,
  drag,
  isActive,
  day,
  handleDelete,
  handleLongPress,
  handlePress,
  handleUpdate,
  selectedSchedulesActivities,
  swipeDirection,
}: RenderItemProps) => {
  return (
    <SheduleCard
      swipeDirection={swipeDirection}
      handleDelete={handleDelete}
      handleEdit={handleUpdate}
      item={item}
      isActive={isActive}
      onDrag={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        drag();
      }}
      onLongPress={handleLongPress}
      onPress={handlePress}
      selectedSchedules={selectedSchedulesActivities}
      day={day}
    />
  );
};
