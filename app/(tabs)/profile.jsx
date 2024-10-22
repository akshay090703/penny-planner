import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { client } from "../../utils/kindeConfig";

export default function Profile() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState();

  const checkAuthenticate = async () => {
    if (await client.isAuthenticated) {
      return;
    } else {
      router.dismissAll();
    }
  };

  useEffect(() => {
    checkAuthenticate();

    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userDetails = await client.getUserDetails();
      setUserInfo(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Are You Sure", "You want to Logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            const loggedOut = await client.logout(true);
            await checkAuthenticate();
          } catch (error) {
            console.error("Error during logout: ", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: userInfo?.picture,
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {userInfo?.given_name + " " + userInfo?.family_name}
          </Text>
          <Text style={styles.profileEmail}>{userInfo?.email}</Text>
          <Text style={styles.profileId}>User ID: {userInfo?.id}</Text>
        </View>

        {/* Example Profile Option */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/history")}
        >
          <Ionicons name="time-outline" size={24} color={Colors.PRIMARY} />
          <Text style={styles.optionText}>View History</Text>
        </TouchableOpacity>

        {/* Logout Option */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.RED} />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.BACKGROUND,
    fontFamily: "outfit",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    marginBottom: 5,
  },
  profileEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GREY,
    marginBottom: 5,
  },
  profileId: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY,
  },
  optionText: {
    fontFamily: "outfit",
    fontSize: 18,
    marginLeft: 10,
  },
});
