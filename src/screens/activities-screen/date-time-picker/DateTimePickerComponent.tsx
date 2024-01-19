import DateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { RadioButton, Text, TextInput } from "react-native-paper";
import Animated, { ZoomInLeft } from "react-native-reanimated";

interface DateTimePickerComponentProps {
  deliveryTime?: string;
  setDeliveryTime: (deliveryTime: string) => void;
  deliveryDay?: string;
  setDeliveryDay: (deliveryDay: string) => void;
}

export const DateTimePickerComponent = ({
  deliveryTime,
  setDeliveryTime,
  deliveryDay,
  setDeliveryDay,
}: DateTimePickerComponentProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  const [openStartDatePicker, setOpenStartDatePicker] =
    useState<boolean>(false);
  const [openStartTimePicker, setOpenStartTimePicker] =
    useState<boolean>(false);
  const [value, setValue] = useState<string>("Sem prazo");

  useEffect(() => {
    if (deliveryDay) {
      const [day, month, year] = deliveryDay.split("/");
      setDate(new Date(+year, +month - 1, +day));
      setValue("Prazo");
    }
    if (deliveryTime) {
      const [hour, minute] = deliveryTime.split(":");
      setTime(new Date(1970, 0, 1, +hour, +minute));
      setValue("Prazo");
    }
  }, [deliveryDay, deliveryTime]);

  const onChangeDate = useCallback((event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setOpenStartDatePicker(false);
      setDate(null);
      return;
    }
    const currentDate = selectedDate || date;
    setOpenStartDatePicker(false);
    setDate(currentDate);
    setDeliveryDay(currentDate?.toLocaleDateString() || "");
  }, []);

  const onChangeTime = useCallback((event: any, selectedTime?: Date) => {
    if (event.type === "dismissed") {
      setTime(null);
      setOpenStartTimePicker(false);
      return;
    }
    const currentTime = selectedTime || time;
    setOpenStartTimePicker(false);
    setTime(currentTime);
    setDeliveryTime(
      currentTime
        ? currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) + ":00"
        : ""
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Prazo:</Text>
      <RadioButton.Group
        onValueChange={(newValue) => {
          setValue(newValue);
          if (newValue === "Sem prazo") {
            setDeliveryTime("");
            setDeliveryDay("");
          } else if (newValue === "Prazo") {
            setDate(null);
            setTime(null);
          }
        }}
        value={value}
      >
        <TouchableWithoutFeedback onPress={() => setValue("Sem prazo")}>
          <View style={styles.rowCentered}>
            <RadioButton value="Sem prazo" />
            <Text>Sem prazo</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setValue("Prazo")}>
          <View style={styles.rowCentered}>
            <RadioButton value="Prazo" />
            <Text>Definir prazo</Text>
          </View>
        </TouchableWithoutFeedback>
      </RadioButton.Group>

      {value === "Prazo" && (
        <Animated.View style={styles.dateTimeContainer} entering={ZoomInLeft}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setOpenStartDatePicker(true)}
          >
            <View style={styles.rowCentered}>
              <TextInput
                label="Data"
                value={date?.toLocaleDateString() || "Sem data"}
                editable={false}
                left={
                  <TextInput.Icon
                    icon="calendar-outline"
                    style={{ marginBottom: 0 }}
                    onPress={() => console.log("add file")}
                  />
                }
              />
            </View>
          </TouchableOpacity>
          {openStartDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date || new Date()}
              mode={"date"}
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setOpenStartTimePicker(true)}
          >
            <View style={styles.rowCentered}>
              <TextInput
                label="Hora"
                value={
                  time
                    ? time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) + ":00"
                    : "Sem hora"
                }
                editable={false}
                left={
                  <TextInput.Icon
                    icon="clock-outline"
                    style={{ marginBottom: 0 }}
                    onPress={() => console.log("add file")}
                  />
                }
              />
            </View>
          </TouchableOpacity>

          {openStartTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time || new Date()}
              mode={"time"}
              display="default"
              onChange={onChangeTime}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 10,
  },
  rowCentered: { flexDirection: "row", alignItems: "center" },
  dateTimeContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    gap: 10,
  },
});
