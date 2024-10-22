import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "./../constants/Colors";
import ColorPicker from "../components/ColorPicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import { supabase } from "../utils/SuperbaseConfig";
import { client } from "../utils/kindeConfig";
import { useRouter } from "expo-router";

export default function AddNewCategory() {
  const [selectedIcon, setSelectedIcon] = useState("IC");
  const [selectedColor, setSelectedColor] = useState(Colors.PURPLE);
  const [categoryName, setCategoryName] = useState();
  const [totalBudget, settotalBudget] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkAuthenticate = async () => {
    if (await client.isAuthenticated) {
      return;
    } else {
      router.replace("/login");
    }
  };

  useEffect(() => {
    checkAuthenticate();
  }, []);

  const onCreateCategory = async () => {
    setLoading(true);
    const user = await client.getUserDetails();

    const { data, error } = await supabase
      .from("category")
      .insert([
        {
          name: categoryName,
          created_by: user.email,
          icon: selectedIcon,
          color: selectedColor,
          assigned_budget: totalBudget,
        },
      ])
      .select();

    console.log(data);
    if (data) {
      ToastAndroid.show("Category Created!", ToastAndroid.LONG);
      router.replace({
        pathname: "/category-detail",
        params: {
          categoryId: data[0].id,
        },
      });
    } else {
      ToastAndroid.show("Some Error occurred!", ToastAndroid.LONG);
    }

    setLoading(false);
  };

  return (
    <View
      style={{
        marginTop: 20,
        padding: 20,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{
            backgroundColor: selectedColor,
            textAlign: "center",
            fontSize: 30,
            padding: 20,
            borderRadius: 99,
            paddingHorizontal: 28,
            color: Colors.WHITE,
          }}
          maxLength={2}
          onChangeText={(value) => setSelectedIcon(value)}
        >
          {selectedIcon}
        </TextInput>
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={(color) => setSelectedColor(color)}
        />
      </View>

      {/* Add Category Name and total budget section */}
      <View style={styles.InputView}>
        <MaterialIcons name="local-offer" size={24} color={Colors.GRAY} />
        <TextInput
          style={{
            width: "100%",
            fontSize: 17,
            fontFamily: "outfit",
          }}
          placeholder="Category Name"
          onChangeText={(v) => setCategoryName(v)}
        />
      </View>
      <View style={styles.InputView}>
        <MaterialIcons name="attach-money" size={24} color={Colors.GRAY} />
        <TextInput
          style={{
            width: "100%",
            fontSize: 17,
            fontFamily: "outfit",
          }}
          keyboardType="numeric"
          placeholder="Total Budget"
          onChangeText={(v) => settotalBudget(v)}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={!categoryName || !totalBudget || loading}
        onPress={() => onCreateCategory()}
      >
        {loading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: Colors.WHITE,
              fontFamily: "outfit",
            }}
          >
            Create
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  InputView: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    padding: 14,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
});
