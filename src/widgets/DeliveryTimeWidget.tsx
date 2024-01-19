/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  ColorProp,
  FlexWidget,
  ListWidget,
  TextWidget,
} from "react-native-android-widget";
import { MMKV } from "react-native-mmkv";
import { ActivityState, ActivityType } from "../contexts/AppContext";
export const storage = new MMKV();

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc"; // Importando o plugin utc
import { getPriorityWidgetColor } from "../helpers/helperFunctions";
import { MyDarkTheme, MyTheme } from "../theme/Theme";
dayjs.extend(customParseFormat);
dayjs.extend(utc);

dayjs.extend(timezone);

// Função para salvar o estado no armazenamento local
export const saveState = <T extends unknown>(key: string, state: T) => {
  storage.set(key, JSON.stringify(state));
};

// Função para recuperar o estado do armazenamento local
export const loadState = <T extends unknown>(key: string): T | undefined => {
  const state = storage.getString(key);
  return state ? (JSON.parse(state) as T) : undefined;
};

interface ListItemProps {
  item: ActivityType;
  color: ColorProp;
  theme: any;
  status: string;
}
const ListItem = ({ item, color, theme, status }: ListItemProps) => {
  return (
    <FlexWidget
      style={{
        padding: 8,
        width: "match_parent",
        height: "wrap_content",

        alignItems: "center",
        flexDirection: "row",
        borderLeftColor: color,
        backgroundColor: theme.dark
          ? "rgba(73, 69, 79, 1)"
          : "rgba(255, 251, 254, 1)",
        borderRadius: 16,
        borderLeftWidth: 10,
      }}
    >
      <FlexWidget
        style={{
          width: "match_parent",
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 4,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: "column",
            height: "wrap_content",
          }}
        >
          {item.title && (
            <TextWidget
              text={item.title}
              style={{
                fontSize: 18,
                color: theme.dark
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(49, 48, 51, 1)",
                fontWeight: "500",
                fontFamily: "Roboto",
                marginBottom: 8,
              }}
            />
          )}
          {item.text && (
            <TextWidget
              text={item.text}
              style={{
                fontSize: 16,
                color: theme.dark
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(49, 48, 51, 1)",
                fontFamily: "Roboto",
              }}
            />
          )}

          {item.deliveryDay && (
            <TextWidget
              text={`${status}${item.deliveryDay} ${
                item.deliveryTime ? "às" : ""
              } ${item.deliveryTime.slice(0, -3)}`}
              style={{
                fontSize: 10,
                color: theme.dark
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(49, 48, 51, 1)",
                fontFamily: "Roboto",
                fontWeight: "bold",
                marginTop: 8,
                backgroundColor: color,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            />
          )}
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
};

function CollectionData() {
  const theme: any = loadState("theme") ?? MyDarkTheme;
  const activities: ActivityState = loadState("activities") ?? {
    checkedTodos: [],
    todos: [],
    withDeadLine: [],
    withPriority: [],
  };

  return (
    <ListWidget
      style={{
        height: "match_parent",
        width: "match_parent",
      }}
    >
      {activities && activities.withDeadLine.length > 0 ? (
        activities.withDeadLine.map((item) => {
          const { color, status } = getPriorityWidgetColor({
            item: item,
            theme: theme,
          });

          return (
            <FlexWidget
              key={item.id}
              style={{
                width: "match_parent",
              }}
              clickAction="OPEN_APP"
            >
              <ListItem
                color={color}
                item={item}
                theme={theme}
                status={status}
              />
              <FlexWidget
                style={{ width: "match_parent", paddingVertical: 8 }}
              />
            </FlexWidget>
          );
        })
      ) : (
        <FlexWidget
          style={{
            width: "match_parent",
            height: "match_parent",
            alignItems: "center",
            justifyContent: "center",
          }}
          clickAction="OPEN_APP"
        >
          <FlexWidget
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TextWidget
              text="Nenuma atividade com prazo..."
              style={{
                fontSize: 16,
                color: theme.dark
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(49, 48, 51, 1)",
                fontFamily: "Roboto",
              }}
            />
          </FlexWidget>
        </FlexWidget>
      )}
    </ListWidget>
  );
}

export function DeliveryTimeWidget() {
  const theme: MyTheme = loadState("theme") ?? MyDarkTheme;
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",

        flexDirection: "column",
        backgroundColor: theme.dark
          ? "rgba(28, 27, 31, 1)"
          : "rgba(231, 224, 236, 1)",
        padding: 16,
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="Prazos"
        style={{
          fontSize: 18,
          fontWeight: "500",
          color: theme.dark
            ? "rgba(208, 188, 255, 1)"
            : "rgba(103, 80, 164, 1)",
          marginBottom: 16,
        }}
      />

      <FlexWidget
        style={{
          width: "match_parent",
          height: "match_parent",
          flex: 1,
          paddingBottom: 16,
        }}
      >
        <CollectionData />
      </FlexWidget>
    </FlexWidget>
  );
}
