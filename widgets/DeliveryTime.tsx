/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  FlexWidget,
  ListWidget,
  ScreenInfo,
  TextWidget,
} from "react-native-android-widget";
import { MMKV } from "react-native-mmkv";
import { ActivityType } from "../contexts/AppContext";

interface CounterWidgetProps {
  count: number;
}
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

export function DeliveryTime({
  height,
  width,

  activitiesUpdate,
}: WidgetProps) {
  const activities: ActivityType[] =
    activitiesUpdate && activitiesUpdate.length > 0
      ? activitiesUpdate
      : loadState("activities") ?? [];

  const hightPriority: ActivityType | null =
    loadState("nextExpiringActivity") ?? null;

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
      <ListWidget>
        {hightPriority ? (
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
                marginBottom: 14,
              }}
              text="Menor prazo:"
            />

            <FlexWidget style={{ flexDirection: "column" }}>
              <TextWidget
                maxLines={2}
                style={{ fontSize: 20, color: "rgba(255, 255, 255, 1)" }}
                text={`${hightPriority.text}`}
              />
              <FlexWidget style={{ flexDirection: "column", marginTop: 14 }}>
                <TextWidget
                  style={{ fontSize: 16, color: "rgba(240, 240, 240, 1)" }}
                  text={`${hightPriority.deliveryDay}`}
                />
                <TextWidget
                  style={{ fontSize: 16, color: "rgba(240, 240, 240, 1)" }}
                  text={`${hightPriority.deliveryTime}`}
                />
              </FlexWidget>
            </FlexWidget>
          </FlexWidget>
        ) : (
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
                marginBottom: 14,
              }}
              text="Sem prazos!"
            />
          </FlexWidget>
        )}
      </ListWidget>
    </FlexWidget>
  );
}
