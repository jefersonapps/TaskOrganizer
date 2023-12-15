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

function CollectionData({
  activitiesUpdate,
}: {
  activitiesUpdate?: ActivityType[];
}) {
  const activities: ActivityType[] =
    activitiesUpdate && activitiesUpdate.length > 0
      ? activitiesUpdate
      : loadState("nextExpiringActivity") ?? [];

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
            color = "rgba(79, 55, 139, 1)";
          } else if (now.isSame(deliveryDateTime, "day")) {
            if (now.isBefore(deliveryDateTime, "minute")) {
              status = "Expira hoje: ";
              color = "rgba(99, 59, 72, 1)";
            } else {
              status = "Expirada: ";
              color = "rgba(140, 29, 24, 1)";
            }
          } else {
            status = "Expirada: ";
            color = "rgba(140, 29, 24, 1)";
          }

          return (
            <FlexWidget key={item.id} style={{ width: "match_parent" }}>
              <FlexWidget
                style={{
                  width: "match_parent",
                  alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 14,
                  borderLeftColor: color,
                  backgroundColor: "rgba(73, 69, 79, 1)",
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
                          fontSize: 16,
                          color: "#ffffff",
                          fontWeight: "500",
                          fontFamily: "Roboto",
                          marginBottom: 8,
                        }}
                      />
                    )}
                    <TextWidget
                      text={item.text}
                      style={{
                        fontSize: 12,
                        color: "#ffffff",
                        fontFamily: "Roboto",
                      }}
                    />

                    {item.deliveryDay && (
                      <TextWidget
                        text={`${status}${item.deliveryDay} ${
                          item.deliveryTime ?? "às"
                        } ${item.deliveryTime}`}
                        style={{
                          fontSize: 12,
                          color: "#ffffff",
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
              <FlexWidget style={{ height: 8 }}></FlexWidget>
            </FlexWidget>
          );
        })
      ) : (
        <FlexWidget
          style={{
            height: "match_parent",
            alignItems: "center",
            justifyContent: "center",
          }}
          clickAction="OPEN_APP"
        >
          <TextWidget
            text="Nenuma atividade com prazo..."
            style={{
              fontSize: 12,
              color: "#ffffff",
              fontFamily: "Roboto",
            }}
          />
        </FlexWidget>
      )}

      <FlexWidget
        style={{
          width: "match_parent",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingTop: 16,
          paddingBottom: 24,
        }}
        clickAction="OPEN_APP"
        // clickActionData={{
        //   uri: 'androidwidgetexample://list/list-demo',
        // }}
      >
        <TextWidget
          text="Abrir o app"
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "rgba(208, 188, 255, 1)",
          }}
        />
      </FlexWidget>
    </ListWidget>
  );
}

export function ListDemoWidget({
  activitiesUpdate,
}: {
  activitiesUpdate?: ActivityType[];
}) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "rgba(28, 27, 31, 1)",
        flexDirection: "column",
        padding: 14,
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
            fontSize: 16,
            fontWeight: "500",
            color: "rgba(208, 188, 255, 1)",
          }}
        />
      </FlexWidget>

      <CollectionData activitiesUpdate={activitiesUpdate} />
    </FlexWidget>
  );
}
