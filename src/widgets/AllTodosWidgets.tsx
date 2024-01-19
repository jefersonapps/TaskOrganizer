/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  FlexWidget,
  ScreenInfo,
  TextWidget,
} from "react-native-android-widget";
import { MMKV } from "react-native-mmkv";
import { ActivityState } from "../contexts/AppContext";
import { MyDarkTheme, MyTheme } from "../theme/Theme";

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
}

export function AllTodosWidgets({ height, width }: WidgetProps) {
  const theme: MyTheme = loadState("theme") ?? MyDarkTheme;
  const activities: ActivityState = loadState("activities") ?? {
    checkedTodos: [],
    todos: [],
    withDeadLine: [],
    withPriority: [],
  };

  return (
    <FlexWidget
      style={{
        height: height ? height : "match_parent",
        width: width ? width : "match_parent",
        alignItems: "center",
        justifyContent: "center",
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget
        style={{
          backgroundColor: theme.dark
            ? "rgba(28, 27, 31, 1)"
            : "rgba(231, 224, 236, 1)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          flex: 1,
          width: "match_parent",
        }}
      >
        <TextWidget
          style={{
            fontSize: 16,
            color: theme.dark
              ? "rgba(255, 255, 255, 1)"
              : "rgba(49, 48, 51, 1)",

            fontWeight: "bold",
          }}
          text="Total"
        />
        <TextWidget
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: theme.dark
              ? "rgba(208, 188, 255, 1)"
              : "rgba(103, 80, 164, 1)",
          }}
          text={`${activities.todos.length + activities.checkedTodos.length}`}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
