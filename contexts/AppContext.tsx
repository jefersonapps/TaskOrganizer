import { createContext, Dispatch } from "react";

export interface File {
  id: string;
  name: string;
  uri: string;
}

export interface ActivityType {
  id: string;
  priority: string;
  timeStamp: string;
  title: string;
  text: string;
  isEdited: boolean;
  deliveryDay: string;
  deliveryTime: string;
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
  type: string;
}

// Crie um único contexto para toda a aplicação
export const AppContext = createContext({
  activities: [] as ActivityType[],
  activitiesDispatch: (() => {}) as Dispatch<Action>,
  files: [] as File[],
  setFiles: (files: File[] | ((prevFiles: File[]) => File[])) => {},
  toggleTheme: () => {},
});
