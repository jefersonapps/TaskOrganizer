import * as Crypto from "expo-crypto";
import { Reducer } from "react";
import { LatexAction, LatexType } from "../contexts/AppContext";

export const latexReducer: Reducer<LatexType[], LatexAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: Crypto.randomUUID(),
          code: action.code ?? "",
          uri: action.uri ?? "",
        },
      ];
    case "delete":
      return state.filter((latex) => latex.id !== action.id);
    case "update":
      return state.map((latex) =>
        latex.id === action.id
          ? { ...latex, code: action.code ?? "", uri: action.uri ?? "" }
          : latex
      );
    case "reorder":
      return action.newOrder ?? state;
    default:
      throw new Error();
  }
};
