/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  BLACK: "#000",
  PRIMARY: "#8B42FC",
  WHITE: "#fff",
  GRAY: "#D4D4D4",
  BLUE: "#4F75FE",
  GREEN: "#13C38B",
  PURPLE: "#9F3CFE",
  RED: "#FF555D",
  ORANGE: "#FF7D4F",
  COLOR_LIST: [
    "#4F75FE",
    // "#13C38B",
    // "#9F3CFE",
    // "#FF555D",
    // "#FF7D4F",
    "#2F0A28",
    // "#CADBC0",
    "#A27E6F",
    "#B1B695",
    "#007090",
    // "#3A015C",
    // "#55DDE0",
  ],
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
