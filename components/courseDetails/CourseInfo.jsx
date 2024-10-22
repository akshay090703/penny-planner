import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import { supabase } from "../../utils/SuperbaseConfig";
import { useRouter } from "expo-router";

export default function CourseInfo({ categoryData }) {
  const [totalCost, setTotalCost] = useState(1);
  const [totalPerc, setTotalPerc] = useState(0);
  const [isMoneyLeft, setIsMoneyLeft] = useState(true);
  const router = useRouter();

  useEffect(() => {
    calculateTotalPerc();
  }, [categoryData]);

  const calculateTotalPerc = () => {
    let total = 0;
    categoryData?.categoryItems?.forEach((item) => (total += item?.cost));

    setTotalCost(total);

    let perc = (total / categoryData?.assigned_budget) * 100;

    setTotalPerc((prev) => (perc >= 100 ? 100 : perc));
  };

  const onDeleteCategory = () => {
    Alert.alert("Are You Sure", "Do you want to Delete?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("categoryItems")
            .delete()
            .eq("category_id", categoryData?.id);

          if (error) {
            ToastAndroid.show(
              "The category items could not be deleted!",
              ToastAndroid.LONG
            );
          } else {
            const { err } = await supabase
              .from("category")
              .delete()
              .eq("id", categoryData?.id);

            if (err) {
              ToastAndroid.show(
                "There was an error while deleting the category!",
                ToastAndroid.LONG
              );
            } else {
              ToastAndroid.show("Category deleted!", ToastAndroid.SHORT);
              router.replace("/");
            }
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (totalPerc >= 100) {
      setIsMoneyLeft(false);
    } else {
      setIsMoneyLeft(true);
    }
  }, [totalPerc]);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text
            style={[styles.textIcon, { backgroundColor: categoryData?.color }]}
          >
            {categoryData?.icon}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={styles.categoryName}>{categoryData?.name}</Text>
          <Text style={styles.categoryItemText}>
            Items: {categoryData?.categoryItems?.length}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onDeleteCategory()}>
          <Ionicons name="trash" size={28} color="red" />
        </TouchableOpacity>
      </View>

      {/* Progess Bar */}
      <View style={styles.amountContainer}>
        <Text style={{ fontFamily: "outfit-bold" }}>Rs. {totalCost}</Text>
        <Text style={{ fontFamily: "outfit" }}>
          Total Budget: {categoryData?.assigned_budget}
        </Text>
      </View>
      <View style={styles.progessBarMainContainer}>
        <View
          style={[styles.progessBarSubcontainer, { width: totalPerc + "%" }]}
        ></View>
      </View>

      {!isMoneyLeft && (
        <Text
          style={{
            fontSize: 18,
            fontFamily: "outfit-bold",
            color: Colors.RED,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          *Oh No, You ran out of your Money!!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textIcon: {
    fontSize: 35,
    padding: 20,
    borderRadius: 15,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "baseline",
    fontFamily: "outfit",
  },
  categoryName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  categoryItemText: {
    fontFamily: "outfit",
    fontSize: 16,
  },
  amountContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 15,
  },
  progessBarMainContainer: {
    width: "100%",
    height: 15,
    backgroundColor: Colors.GRAY,
    borderRadius: 99,
    marginTop: 7,
  },
  progessBarSubcontainer: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    height: 15,
  },
});
