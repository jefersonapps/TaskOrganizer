import { DefaultTheme, MD3DarkTheme, useTheme } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

export type MyTheme = ThemeProp & {
  colors: {
    customBackground: string;
  };
};

export const MyLightTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    customBackground: "#e6e6e6",
  },
};

export const MyDarkTheme: MyTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    customBackground: "#121214",
  },
};
export type AppTheme = typeof MyLightTheme;

export const useAppTheme = () => useTheme<AppTheme>();
