import { View, Text, Image, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../constants/Colors";
import { TouchableOpacity } from "react-native";
import { client } from "../../utils/kindeConfig";
import services from "../../utils/services";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    checkAuthenticate();
  }, []);

  const checkAuthenticate = async () => {
    if (await client.isAuthenticated) {
      ToastAndroid.show("User is already logged In!", ToastAndroid.SHORT);
      router.replace("/");
    }
  };

  const handleSignIn = async () => {
    const token = await client.login();
    if (token) {
      // User was authenticated

      await services.storeData("login", "true");
      router.replace("/");
    }
  };
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/images/homepage.png")}
        style={styles.bgImage}
      />
      <View
        style={{
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          height: "100%",
          padding: 20,
          marginTop: -30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Personal Budget Planner
        </Text>

        <Text
          style={{
            fontSize: 17,
            textAlign: "center",
            color: Colors.WHITE,
            marginTop: 20,
          }}
        >
          Stay on Track, Event by Event: Your Personal Budget Planner App!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text
            style={{
              textAlign: "center",
              color: Colors.PRIMARY,
            }}
          >
            Login/Signup
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 13,
            color: Colors.GRAY,
            marginTop: 10,
          }}
        >
          * By login/signup you will agree to our terms and conditions.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    width: 200,
    height: 400,
    marginTop: 60,
    borderWidth: 5,
    borderRadius: 20,
    borderColor: Colors.BLACK,
  },
  button: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    paddingHorizontal: 5,
    borderRadius: 99,
    marginTop: 30,
  },
});