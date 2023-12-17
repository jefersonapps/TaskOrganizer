/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  ColorProp,
  FlexWidget,
  ListWidget,
  TextWidget,
} from "react-native-android-widget";
import { ActivityType } from "../contexts/AppContext";
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import utc from "dayjs/plugin/utc"; // Importando o plugin utc
dayjs.extend(utc);
import timezone from "dayjs/plugin/timezone";
import { MyDarkTheme, MyTheme } from "../theme/Theme";

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

function CollectionData() {
  const theme: MyTheme = loadState("theme") ?? MyDarkTheme;
  const activities: ActivityType[] = loadState("nextExpiringActivity") ?? [];

  return (
    <ListWidget
      style={{
        height: "match_parent",
        width: "match_parent",
      }}
    >
      {activities && activities.length > 0 ? (
        activities.map((item) => {
          const now = dayjs().utc(true);

          let status;
          let color: ColorProp;

          const deliveryDateTime = dayjs.utc(
            `${item.deliveryDay} ${
              item.deliveryTime ? item.deliveryTime : "00:00:00"
            }`,
            "DD/MM/YYYY HH:mm:ss"
          );

          if (now.isBefore(deliveryDateTime, "day")) {
            status = "Prazo: ";
            color = theme.dark
              ? "rgba(79, 55, 139, 1)"
              : "rgba(234, 221, 255, 1)";
          } else if (now.isSame(deliveryDateTime, "day")) {
            if (now.isBefore(deliveryDateTime, "minute")) {
              status = "Expira hoje: ";
              color = theme.dark
                ? "rgba(99, 59, 72, 1)"
                : "rgba(249, 222, 220, 1)";
            } else {
              status = "Expirada: ";
              color = theme.dark
                ? "rgba(140, 29, 24, 1)"
                : "rgba(255, 216, 228, 1)";
            }
          } else {
            status = "Expirada: ";
            color = theme.dark
              ? "rgba(140, 29, 24, 1)"
              : "rgba(255, 216, 228, 1)";
          }

          return (
            <FlexWidget
              clickAction="OPEN_APP"
              key={item.id}
              style={{
                width: "match_parent",
                height: "wrap_content",
              }}
            >
              <FlexWidget
                style={{
                  height: "match_parent",
                  width: "match_parent",
                  flex: 1,
                }}
              >
                <FlexWidget
                  style={{
                    width: "match_parent",
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: 14,
                    borderLeftColor: color,
                    backgroundColor: theme.dark
                      ? "rgba(73, 69, 79, 1)"
                      : "rgba(255, 251, 254, 1)",
                    borderRadius: 16,
                    borderLeftWidth: 10,
                    padding: 8,
                  }}
                  clickAction="OPEN_APP"
                  //   clickActionData={{
                  //     uri: `androidwidgetexample://list/list-demo/${i + 1}`,
                  //   }}
                >
                  <FlexWidget
                    style={{
                      width: "match_parent",

                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                    }}
                  >
                    <FlexWidget
                      style={{
                        flexDirection: "column",
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
              </FlexWidget>
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
        backgroundColor: theme.dark
          ? "rgba(28, 27, 31, 1)"
          : "rgba(231, 224, 236, 1)",
        flexDirection: "column",
        padding: 18,
        borderRadius: 16,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "match_parent",
          marginBottom: 16,
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
          }}
        />
      </FlexWidget>

      <CollectionData />
    </FlexWidget>
  );
}
