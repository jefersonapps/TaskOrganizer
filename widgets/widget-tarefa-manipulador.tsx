import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { HelloWidget } from "./HelloWidget";
import { MMKV } from "react-native-mmkv";
import { ActivityType } from "../contexts/AppContext";
import { DeliveryTime } from "./DeliveryTime";
import { ListDemoWidget } from "./ListDemoWidget";

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

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
  ListDemoWidget: ListDemoWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
      props.renderWidget(<Widget {...widgetInfo} />);
      break;

    case "WIDGET_UPDATE":
      props.renderWidget(<Widget {...widgetInfo} />);
      // Not needed for now
      break;

    case "WIDGET_RESIZED":
      // Handle resizing by updating the widget dimensions
      const updatedWidget = <Widget {...widgetInfo} />;
      props.renderWidget(updatedWidget);
      break;

    case "WIDGET_DELETED":
      // Not needed for now
      break;

    case "WIDGET_CLICK":
      if (props.clickAction === "refresh") {
        const activities: ActivityType[] = loadState("activities") ?? [];
        props.renderWidget(
          <Widget activitiesUpdate={activities} {...widgetInfo} />
        );
      }
      break;

    default:
      break;
  }
}
