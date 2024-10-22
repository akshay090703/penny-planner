import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { client } from "@/utils/kindeConfig";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function Header() {
  const [user, setUser] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Image
        source={{
          uri: user?.picture,
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 99,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "85%",
        }}
      >
        <View>
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: 15,
              fontFamily: "outfit",
            }}
          >
            Welcome
          </Text>
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: 19,
              fontFamily: "outfit-bold",
            }}
          >
            {user?.given_name}
          </Text>
        </View>
        <Ionicons name="notifications" size={24} color="white" />
      </View>
    </View>
  );
}
