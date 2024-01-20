import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import * as Linking from "expo-linking";
import * as Notify from "expo-notifications";
import { ActivityType, File } from "../contexts/AppContext";
dayjs.extend(duration);

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { Camera } from "react-native-vision-camera";

import { ToastAndroid } from "react-native";
import { ColorProp } from "react-native-android-widget";
import { AppTheme } from "../theme/Theme";

export function formatSecondsInDaysHoursAndMinutes(seconds: number): string {
  const durationTime = dayjs.duration(seconds, "seconds");
  let formatedTime = "";

  if (durationTime.days() > 0) {
    formatedTime += `${durationTime.days()}d `;
  }
  if (durationTime.hours() > 0) {
    formatedTime += `${durationTime.hours()}h `;
  }

  if (durationTime.minutes() > 0) {
    formatedTime += `${durationTime.minutes()}m `;
  }
  if (durationTime.seconds() > 0) {
    formatedTime += `${
      durationTime.minutes() > 0 ? "e" : ""
    } ${durationTime.seconds()}s`;
  }

  return formatedTime;
}

export function formatTimeStamp(dataISO: string) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Os meses são de 0 a 11, então adicionamos 1
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  const segundos = String(data.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;
}

export const formatName = (userName: string) => {
  const nameParts = userName.toLowerCase().split(" ");
  const firstName = nameParts[0];
  const secondName = nameParts.length > 1 ? nameParts[1] : "";

  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const capitalizedSecondName =
    secondName.charAt(0).toUpperCase() + secondName.slice(1);

  const addSpace = capitalizedSecondName ? " " : "";

  return capitalizedFirstName + addSpace + capitalizedSecondName;
};

export function getIconForFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "doc":
    case "docx":
      return "file-word";
    case "ppt":
    case "pptx":
      return "file-powerpoint";
    case "xls":
    case "xlsx":
      return "file-excel";
    case "pdf":
      return "file-pdf-box";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "file-image";
    case "mp3":
    case "wav":
    case "ogg":
    case "opus":
    case "m4a":
      return "file-music";
    default:
      return "file";
  }
}

export function getColorForFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "doc":
    case "docx":
      return "#4a86e8"; // Azul para Word
    case "ppt":
    case "pptx":
      return "#ff6f00"; // Laranja para PowerPoint
    case "xls":
    case "xlsx":
      return "#38761d"; // Verde para Excel
    case "pdf" || "PDF":
      return "#cc0000"; // Vermelho para PDF
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "#6aa84f"; // Verde para imagens
    case "mp3":
    case "wav":
    case "ogg":
    case "opus":
    case "m4a":
      return "#674ea7"; // Roxo para arquivos de música
    default:
      return "gray"; // Preto para outros tipos de arquivo
  }
}

export const handleVisitSite = (link: string) => {
  let fullURL = link;
  if (!link.startsWith("http://") && !link.startsWith("https://")) {
    fullURL = "https://" + link;
  }
  Linking.openURL(fullURL).catch((err: any) =>
    console.error("An error occurred", err)
  );
};

export const cancelNotification = async (
  identifier: string | null | undefined,
  isEditing?: boolean
) => {
  if (identifier) {
    await Notify.cancelScheduledNotificationAsync(identifier);
    if (!isEditing) showToast("Notificação cancelada.");
  }
};

export const sendNotification = async (
  sec: number,
  title: string,
  body: string,
  data: { id: string }
) => {
  if (sec < 0 || !sec) return null;

  const identifier = await Notify.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data,
    },
    trigger: {
      seconds: sec,
    },
  });
  return identifier;
};

interface NotificationIds {
  notificationIdExactTime: string | null;
  notificationIdBeginOfDay: string | null;
}

export const getNotificationIds = async (
  deliveryDay: string,
  deliveryTime: string,
  userName: string,
  activityText: string,
  activityId: string
): Promise<NotificationIds> => {
  const now = new Date();
  const [day, month, year] = deliveryDay.split("/");
  const formattedDeliveryDay = `${year}-${month}-${day}`;
  const deliveryDateTime = `${formattedDeliveryDay}T${deliveryTime}`;
  const nowDayJs = dayjs();
  const delivery = dayjs(deliveryDateTime);
  const secondsExact = delivery.diff(nowDayJs, "second");
  const oUpperOrLowe = userName ? ", o" : "O";
  const userNameCapitalized = userName ? formatName(userName) : "";
  const notificationIdExactTime = await sendNotification(
    secondsExact,
    userNameCapitalized + oUpperOrLowe + " prazo acabou... 😥️",
    "Atividade: " + activityText,
    { id: activityId }
  );

  if (secondsExact >= 0) {
    const formatedTime = formatSecondsInDaysHoursAndMinutes(secondsExact);
    const toastText = `Prazo se expira em ${formatedTime}.`;
    showToast(toastText);
  }

  const deliveryDate = new Date(`${formattedDeliveryDay}T00:00`);
  const secondsUntilDelivery = (deliveryDate.getTime() - now.getTime()) / 1000;
  let notificationIdBeginOfDay = null;
  if (secondsUntilDelivery > 0) {
    notificationIdBeginOfDay = await sendNotification(
      secondsUntilDelivery,
      userNameCapitalized + oUpperOrLowe + " prazo está acabando! ⏳️🔥️",
      `Sua atividade se expira hoje: ${activityText}`,
      { id: activityId }
    );
  }
  return { notificationIdExactTime, notificationIdBeginOfDay };
};

export async function checkPermissions() {
  const cameraStatus = await Camera.requestCameraPermission();
  const { status: mediaStatus } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  const { status: saveImageStatus } =
    await MediaLibrary.requestPermissionsAsync();
  const { status: notificationStatus } =
    await Notifications.requestPermissionsAsync();

  return {
    cameraPermission: cameraStatus === "authorized" ? "granted" : "denied",
    mediaLibraryPermission: mediaStatus === "granted" ? "granted" : "denied",
    saveImagePermission: saveImageStatus === "granted" ? "granted" : "denied",
    notificationPermission:
      notificationStatus === "granted" ? "granted" : "denied",
  };
}

export function convertToDateTime(dateStr: string, timeStr: string) {
  const time = timeStr || "00:00";
  const dateTimeStr = dateStr + " " + time;
  return dayjs(dateTimeStr, "DD/MM/YYYY HH:mm");
}

interface GetPriorityColorArgs {
  item: ActivityType;
  theme: AppTheme;
}

export function getPriorityColor({ item, theme }: GetPriorityColorArgs) {
  const now = dayjs().utc(true);

  const deliveryDateTime = dayjs.utc(
    `${item.deliveryDay} ${item.deliveryTime ? item.deliveryTime : "00:00:00"}`,
    "DD/MM/YYYY HH:mm:ss"
  );

  let status;
  let color;

  if (now.isBefore(deliveryDateTime, "day")) {
    status = "Prazo: ";
    color = theme.colors.surfaceVariant;
  } else if (now.isSame(deliveryDateTime, "day")) {
    if (now.isBefore(deliveryDateTime, "minute")) {
      status = "Expira hoje: ";
      color = theme.dark
        ? theme.colors.tertiaryContainer
        : theme.colors.errorContainer;
    } else {
      status = "Expirada: ";
      color = theme.dark
        ? theme.colors.errorContainer
        : theme.colors.tertiaryContainer;
    }
  } else {
    status = "Expirada: ";
    color = theme.dark
      ? theme.colors.errorContainer
      : theme.colors.tertiaryContainer;
  }
  return { status, color };
}

export function showToast(message: string) {
  ToastAndroid.show(message, ToastAndroid.LONG);
}

export function getPriorityWidgetColor({ item, theme }: GetPriorityColorArgs) {
  const now = dayjs().utc(true);

  let status;
  let color: ColorProp;

  const deliveryDateTime = dayjs.utc(
    `${item.deliveryDay} ${item.deliveryTime ? item.deliveryTime : "00:00:00"}`,
    "DD/MM/YYYY HH:mm:ss"
  );

  if (now.isBefore(deliveryDateTime, "day")) {
    status = "Prazo: ";
    color = theme.dark ? "rgba(79, 55, 139, 1)" : "rgba(234, 221, 255, 1)";
  } else if (now.isSame(deliveryDateTime, "day")) {
    if (now.isBefore(deliveryDateTime, "minute")) {
      status = "Expira hoje: ";
      color = theme.dark ? "rgba(99, 59, 72, 1)" : "rgba(249, 222, 220, 1)";
    } else {
      status = "Expirada: ";
      color = theme.dark ? "rgba(140, 29, 24, 1)" : "rgba(255, 216, 228, 1)";
    }
  } else {
    status = "Expirada: ";
    color = theme.dark ? "rgba(140, 29, 24, 1)" : "rgba(255, 216, 228, 1)";
  }
  return { status, color };
}
