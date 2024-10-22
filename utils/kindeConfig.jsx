import { KindeSDK } from "@kinde-oss/react-native-sdk-0-7x";

export const client = new KindeSDK(
  process.env.EXPO_PUBLIC_YOUR_KINDE_ISSUER,
  process.env.EXPO_PUBLIC_YOUR_KINDE_REDIRECT_URI,
  process.env.EXPO_PUBLIC_YOUR_KINDE_CLIENT_ID,
  process.env.EXPO_PUBLIC_YOUR_KINDE_LOGOUT_REDIRECT_URI
);
