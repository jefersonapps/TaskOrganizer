import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, RadioButton, Text } from "react-native-paper";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

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

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setOpenStartDatePicker(false);
    setDate(currentDate);
    setDeliveryDay(currentDate?.toLocaleDateString() || "");
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
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
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        gap: 10,
        paddingBottom: 10,
      }}
    >
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="Sem prazo" />
            <Text>Sem prazo</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setValue("Prazo")}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="Prazo" />
            <Text>Definir prazo</Text>
          </View>
        </TouchableWithoutFeedback>
      </RadioButton.Group>

      {value === "Prazo" && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setOpenStartDatePicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            />
          )}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setOpenStartTimePicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        </View>
      )}
    </View>
  );
};
