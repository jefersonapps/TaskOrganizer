/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  FlexWidget,
  ScreenInfo,
  TextWidget,
} from "react-native-android-widget";
import { MMKV } from "react-native-mmkv";
import { ActivityType } from "../contexts/AppContext";

export const storage = new MMKV();

// Função para salvar o estado no armazenamento local
export const saveState = <T extends unknown>(key: string, state: T) => {
  storage.set(key, JSON.stringify(state));
};

// Função para recuperar o estado do armazenamento local
export const loadState = <T extends unknown>(key: string): T | undefined => {
  const state = storage.getString(key);
  return state ? (JSON.parse(state) as T) : undefined;
};

interface WidgetProps {
  widgetName?: string;
  widgetId?: number;
  height?: number;
  width?: number;
  screenInfo?: ScreenInfo;
  activitiesUpdate?: ActivityType[];
}

export function HelloWidget({
  height,
  width,

  activitiesUpdate,
}: WidgetProps) {
  const activities: ActivityType[] =
    activitiesUpdate && activitiesUpdate.length > 0
      ? activitiesUpdate
      : loadState("activities") ?? [];

  return (
    <FlexWidget
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(73, 69, 79, 1)",
        height: height ? height : "match_parent",
        width: width ? width : "match_parent",
        borderRadius: 32,
        flex: 1,
        flexDirection: "row",
        flexGap: 48,
        padding: 14,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextWidget
          style={{
            fontSize: 12,
            color: "rgba(255, 255, 255, 1)",
            marginBottom: 8,
            fontWeight: "bold",
          }}
          text="Total de Atividades"
        />
        <TextWidget
          style={{ fontSize: 48, color: "rgba(208, 188, 255, 1)" }}
          text={`${activities.length}`}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
