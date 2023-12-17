import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { TodoWidget } from "./TodoWidget";

import { DeliveryTimeWidget } from "./DeliveryTimeWidget";
import { CheckedTodosWidget } from "./CheckedTodosWidget";
import { AllTodosWidgets } from "./AllTodosWidgets";

const nameToWidget = {
  TodoWidget: TodoWidget,
  DeliveryTimeWidget: DeliveryTimeWidget,
  CheckedTodosWidget: CheckedTodosWidget,
  AllTodosWidgets: AllTodosWidgets,
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
      break;

    default:
      break;
  }
}
