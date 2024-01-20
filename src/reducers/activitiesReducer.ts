import * as Crypto from "expo-crypto";
import { Reducer } from "react";
import { priorityLevels } from "../constants/constants";
import { Action, ActivityState, ActivityType } from "../contexts/AppContext";
import { convertToDateTime } from "../helpers/helperFunctions";

export const activitiesReducer: Reducer<ActivityState, Action> = (
  state,
  action
) => {
  switch (action.type) {
    case "add":
      const newActivity = {
        id: action.id || Crypto.randomUUID(),
        text: action.text || "",
        priority: action.priority || "baixa",
        timeStamp: action.timeStamp || "",
        isEdited: action.isEdited || false,
        deliveryDay: action.deliveryDay || "",
        deliveryTime: action.deliveryTime || "",
        title: action.title || "",
        checked: action.checked || false,
        notificationId: action.notificationId || null,
      };

      let newWithDeadLine = state.withDeadLine;
      if (newActivity.deliveryDay) {
        newWithDeadLine = [...newWithDeadLine, newActivity];
        newWithDeadLine.sort((a, b) => {
          const dateTimeA = convertToDateTime(a.deliveryDay, a.deliveryTime);
          const dateTimeB = convertToDateTime(b.deliveryDay, b.deliveryTime);
          return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
        });
      }

      let newWithPriority = state.withPriority;
      if (newActivity.priority) {
        newWithPriority = [...newWithPriority, newActivity];
        newWithPriority.sort((a, b) => {
          return priorityLevels[b.priority] - priorityLevels[a.priority];
        });
      }

      return {
        todos: newActivity.checked
          ? state.todos
          : [...state.todos, newActivity],
        checkedTodos: newActivity.checked
          ? [...state.checkedTodos, newActivity]
          : state.checkedTodos,
        withDeadLine: newWithDeadLine,
        withPriority: newWithPriority,
      };

    case "delete":
      return {
        todos: state.todos.filter((activity) => activity.id !== action.id),
        checkedTodos: state.checkedTodos.filter(
          (activity) => activity.id !== action.id
        ),
        withDeadLine: state.withDeadLine.filter(
          (activity) => activity.id !== action.id
        ),
        withPriority: state.withPriority.filter(
          (activity) => activity.id !== action.id
        ),
      };
    case "update":
      const updateActivity = (activities: ActivityType[]) =>
        activities.map((activity) =>
          activity.id === action.activity?.id ? action.activity : activity
        );

      let updatedWithDeadLine = updateActivity(state.withDeadLine);
      if (action.activity?.deliveryDay) {
        updatedWithDeadLine.sort((a, b) => {
          const dateTimeA = convertToDateTime(a.deliveryDay, a.deliveryTime);
          const dateTimeB = convertToDateTime(b.deliveryDay, b.deliveryTime);
          return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
        });
      }

      let updatedWithPriority = updateActivity(state.withPriority);
      if (action.activity?.priority) {
        updatedWithPriority.sort((a, b) => {
          return priorityLevels[b.priority] - priorityLevels[a.priority];
        });
      }

      return {
        todos: updateActivity(state.todos),
        checkedTodos: updateActivity(state.checkedTodos),
        withDeadLine: updatedWithDeadLine,
        withPriority: updatedWithPriority,
      };

    case "check":
      const activityToCheck =
        state.todos.find((activity) => activity.id === action.id) ||
        state.checkedTodos.find((activity) => activity.id === action.id) ||
        state.withDeadLine.find((activity) => activity.id === action.id) ||
        state.withPriority.find((activity) => activity.id === action.id);

      if (!activityToCheck) {
        throw new Error(`Activity with id ${action.id} not found`);
      }

      const checkedActivity = {
        ...activityToCheck,
        checked: !activityToCheck.checked,
      };

      return {
        todos: checkedActivity.checked
          ? state.todos.filter((activity) => activity.id !== action.id)
          : [...state.todos, checkedActivity],
        checkedTodos: checkedActivity.checked
          ? [...state.checkedTodos, checkedActivity]
          : state.checkedTodos.filter((activity) => activity.id !== action.id),
        withDeadLine:
          checkedActivity.deliveryDay &&
          !state.withDeadLine.find((activity) => activity.id === action.id)
            ? [...state.withDeadLine, checkedActivity]
            : state.withDeadLine.filter(
                (activity) => activity.id !== action.id
              ),
        withPriority:
          checkedActivity.priority &&
          !state.withPriority.find((activity) => activity.id === action.id)
            ? [...state.withPriority, checkedActivity]
            : state.withPriority.filter(
                (activity) => activity.id !== action.id
              ),
      };

    case "reorder": {
      if (typeof action.listName !== "string") {
        throw new Error(
          `Expected listName to be a string, got ${typeof action.listName}`
        );
      }
      return {
        ...state,
        [action.listName]: action.newOrder,
      };
    }

    default:
      throw new Error();
  }
};
