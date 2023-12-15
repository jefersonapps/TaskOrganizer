import type { ConfigContext, ExpoConfig } from "expo/config";
import type { WithAndroidWidgetsParams } from "react-native-android-widget";

const widgetConfig: WithAndroidWidgetsParams = {
  // Paths to all custom fonts used in all widgets

  widgets: [
    {
      name: "Hello", // This name will be the **name** with which we will reference our widget.
      label: "Atividades", // Label shown in the widget picker
      minWidth: "100dp",
      minHeight: "40dp",
      description: "Total de atividades", // Description shown in the widget picker
      previewImage: "./assets/widget-preview/total-acivities.jpeg", // Path to widget preview image
      updatePeriodMillis: 1800000,
      resizeMode: "horizontal|vertical",
    },
    {
      name: "ListDemoWidget", // This name will be the **name** with which we will reference our widget.
      label: "Atividades com prazo", // Label shown in the widget picker
      minWidth: "100dp",
      minHeight: "40dp",
      description: "Lista de atividades com prazo", // Description shown in the widget picker
      previewImage: "./assets/widget-preview/delivery-date-time-widget.jpeg", // Path to widget preview image
      updatePeriodMillis: 1800000,
      resizeMode: "horizontal|vertical",
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "TaskOrganizer",
  slug: "TaskOrganizer",
  plugins: [["react-native-android-widget", widgetConfig]],
});
