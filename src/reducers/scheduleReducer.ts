import * as Crypto from "expo-crypto";
import { Reducer } from "react";
import { ActionSchedule, ScheduleActivityType } from "../contexts/AppContext";

export const scheduleReducer: Reducer<
  Record<string, ScheduleActivityType[]>,
  ActionSchedule
> = (state, action) => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        [action.day]: [
          ...(state[action.day] || []),
          {
            id: Crypto.randomUUID(),
            text: action.text || "",
            title: action.title || "",
            priority: action.priority || "baixa",
          },
        ],
      };
    case "delete":
      return {
        ...state,
        [action.day]: (state[action.day] || []).filter(
          (activity) => activity.id !== action.id
        ),
      };
    case "update":
      return {
        ...state,
        [action.day]: (state[action.day] || []).map((activity) =>
          activity.id === action.activity?.id ? action.activity : activity
        ),
      };
    case "reorder":
      return {
        ...state,
        [action.day]: action.activities,
      };
    default:
      throw new Error();
  }
};
