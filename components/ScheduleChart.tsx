import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useAppTheme } from "../theme/Theme";
import { Chip, Text } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

type Day = "Dom" | "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sab";
type SheduleActivityType = {
  id: string;
  text: string;
  title: string;
};
type Data = Record<Day, SheduleActivityType[]>;

interface Props {
  data: Record<string, SheduleActivityType[]>;
}

const Bar: React.FC<{
  height: number;
  day: string;
  theme: any;
  number: number;
}> = ({ height, day, theme, number }) => {
  const heightValue = useSharedValue(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      heightValue.value = withTiming(height ? height : 0);
    } else {
      heightValue.value = 0;
    }
  }, [isFocused, height]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
    };
  });

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{number}</Text>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 24,
            backgroundColor: theme.colors.primaryContainer,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          },
        ]}
      />
      <Text style={{ fontWeight: "bold" }}>{day}</Text>
    </View>
  );
};

export const ScheduleChart: React.FC<Props> = ({ data }) => {
  const defaultData: Data = {
    Dom: [],
    Seg: [],
    Ter: [],
    Qua: [],
    Qui: [],
    Sex: [],
    Sab: [],
  };

  const mergedData = useMemo(() => {
    return { ...defaultData, ...data };
  }, [data]);

  const [activityCounts, setActivityCounts] = useState<Record<string, number>>(
    {}
  );

  const theme = useAppTheme();

  const [maxCount, setMaxCount] = useState<number>(0);

  const initialCounts: Record<Day, number> = {
    Dom: 0,
    Seg: 0,
    Ter: 0,
    Qua: 0,
    Qui: 0,
    Sex: 0,
    Sab: 0,
  };

  useEffect(() => {
    const counts = { ...initialCounts };
    (Object.keys(mergedData) as Day[]).forEach((day) => {
      counts[day] = mergedData[day].length;
    });
    setActivityCounts(counts);

    setMaxCount(Math.max(...Object.values(counts)));
  }, [mergedData]);

  const totalActivities = useMemo(() => {
    return Object.values(activityCounts).reduce((a, b) => a + b, 0);
  }, [activityCounts]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ gap: 8 }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Chip mode="flat" textStyle={{ fontWeight: "bold" }}>
            Total:{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
              {totalActivities}
            </Text>
          </Chip>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            height: 144,
            alignItems: "flex-end",
          }}
        >
          {Object.keys(mergedData).map((day) => {
            const height = Math.round((activityCounts[day] / maxCount) * 100);
            return (
              <Bar
                key={day}
                height={height}
                day={day !== "Sab" ? day : "Sáb"}
                theme={theme}
                number={activityCounts[day]}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
