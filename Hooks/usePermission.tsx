import { useState, useCallback, useEffect } from "react";
import { Camera } from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

export const useCameraPermission = () => {
  const [cameraPermission, setCameraPermission] = useState("granted");

  const requestCameraPermission = useCallback(async () => {
    const status = await Camera.requestCameraPermission();
    setCameraPermission(status === "authorized" ? "granted" : "denied");
  }, []);

  // Chame a função requestCameraPermission quando o hook for usado pela primeira vez
  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  return { cameraPermission, requestCameraPermission };
};

export const useMediaLibraryPermission = () => {
  const [mediaLibraryPermission, setMediaLibraryPermission] =
    useState("granted");

  const requestMediaLibraryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setMediaLibraryPermission(status === "granted" ? "granted" : "denied");
  }, []);

  useEffect(() => {
    requestMediaLibraryPermission();
  }, [requestMediaLibraryPermission]);

  return { mediaLibraryPermission, requestMediaLibraryPermission };
};

export const useNotificationPermission = () => {
  const [notificationPermission, setNotificationPermission] =
    useState("granted");

  const requestNotificationPermission = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermission(status === "granted" ? "granted" : "denied");
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return { notificationPermission, requestNotificationPermission };
};
