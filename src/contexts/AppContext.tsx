import { createContext, Dispatch, SetStateAction } from "react";
import { MyTheme } from "../theme/Theme";

export interface File {
  id: string;
  name: string;
  uri: string;
}

export type NotificationIdType = {
  notificationIdBeginOfDay: string | null | undefined;
  notificationIdExactTime: string | null | undefined;
} | null;

export interface ActivityType {
  id: string;
  priority: string;
  timeStamp: string;
  title: string;
  text: string;
  isEdited: boolean;
  deliveryDay: string;
  deliveryTime: string;
  checked: boolean;
  notificationId?: NotificationIdType;
}

export interface LatexType {
  id: string;
  code: string;
  uri: string;
}

export interface LatexAction {
  id?: string;
  code?: string;
  uri?: string;
  type: string;
  newOrder?: LatexType[];
}

export interface Action {
  id?: string;
  title?: string;
  text?: string;
  activity?: ActivityType;
  priority?: string;
  timeStamp?: string;
  isEdited?: boolean;
  deliveryDay?: string;
  deliveryTime?: string;
  checked?: boolean;
  type: string;
  notificationId?: NotificationIdType;
}

export type ActionShedule =
  | { type: "add"; day: string; text: string; title: string }
  | { type: "delete"; day: string; id: string }
  | { type: "update"; day: string; activity?: SheduleActivityType }
  | { type: "reorder"; day: string; activities: SheduleActivityType[] };

export type SheduleActivityType = {
  id: string;
  text: string;
  title: string;
};

export type Scan = {
  imageUri: string | null;
  content: string;
};

export const AppContext = createContext({
  activities: [] as ActivityType[],
  activitiesDispatch: (() => {}) as Dispatch<Action>,
  schedule: {} as Record<string, SheduleActivityType[]>,
  sheduleDispatch: (() => {}) as Dispatch<ActionShedule>,
  equations: [] as LatexType[],
  dispatchEquations: (() => {}) as Dispatch<LatexAction>,
  files: [] as File[],
  setFiles: (files: File[] | ((prevFiles: File[]) => File[])) => {},
  setTheme: (() => {}) as Dispatch<SetStateAction<MyTheme>>,
  image: null as string | null,
  setImage: (
    value: ((prevState: string | null) => string | null) | string | null
  ) => {},
  userName: "" as string,
  setUserName: (value: string | ((prevState: string) => string)) => {},
  imageSource: null as string | null,
  setImageSource: (
    value: ((prevState: string | null) => string | null) | string | null
  ) => {},
  ocrResult: "" as string,
  setOcrResult: (value: string | ((prevState: string) => string)) => {},
  isBiometricEnabled: false as boolean,
  setIsBiometricEnabled: (value: boolean) => {},
  recentReaders: [] as Scan[],
  setRecentReaders: (value: Scan[] | ((prevState: Scan[]) => Scan[])) => {},
  idOfNotification: null as string | null | number,
});
