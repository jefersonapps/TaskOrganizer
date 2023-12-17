import type { ConfigContext, ExpoConfig } from "expo/config";
import type { WithAndroidWidgetsParams } from "react-native-android-widget";

const widgetConfig: WithAndroidWidgetsParams = {
  // Paths to all custom fonts used in all widgets

  widgets: [
    {
      name: "DeliveryTimeWidget", // This name will be the **name** with which we will reference our widget.
      label: "Atividades com prazo", // Label shown in the widget picker
      minWidth: "100dp",
      minHeight: "140dp",
      description: "Lista de atividades com prazo", // Description shown in the widget picker
      previewImage: "./src/assets/widget-preview/delivery-datetime-widget.png", // Path to widget preview image
      updatePeriodMillis: 1800000,
      resizeMode: "horizontal|vertical",
    },
    {
      name: "TodoWidget", // This name will be the **name** with which we will reference our widget.
      label: "Atividades a fazer", // Label shown in the widget picker
      minWidth: "40dp",
      minHeight: "40dp",
      description: "Total de atividades a fazer", // Description shown in the widget picker
      previewImage: "./src/assets/widget-preview/todos-widget.png", // Path to widget preview image
      updatePeriodMillis: 1800000,
      resizeMode: "horizontal|vertical",
    },
    {
      name: "AllTodosWidgets", // This name will be the **name** with which we will reference our widget.
      label: "Todas as atividades", // Label shown in the widget picker
      minWidth: "40dp",
      minHeight: "40dp",
      description: "Total de atividades", // Description shown in the widget picker
      previewImage: "./src/assets/widget-preview/all-activities-widget.png", // Path to widget preview image
      updatePeriodMillis: 1800000,
      resizeMode: "horizontal|vertical",
    },
    {
      name: "CheckedTodosWidget", // This name will be the **name** with which we will reference our widget.
      label: "Atividades concluídas", // Label shown in the widget picker
      minWidth: "40dp",
      minHeight: "40dp",
      description: "Total de atividades concluídas", // Description shown in the widget picker
      previewImage: "./src/assets/widget-preview/checked-todos-widget.png", // Path to widget preview image
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
