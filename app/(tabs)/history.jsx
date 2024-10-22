import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { client } from "../../utils/kindeConfig";
import { supabase } from "../../utils/SuperbaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function History() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState();
  const [loading, setLoading] = useState(false);

  const getCategoryList = async () => {
    setLoading(true);
    const userProfile = await client.getUserDetails();

    const { data, error } = await supabase
      .from("category")
      .select("*,categoryItems(*)")
      .eq("created_by", userProfile.email);

    setCategoryList(data.reverse());
    data && setLoading(false);
  };

  useEffect(() => {
    checkAuthenticate();
    getCategoryList();
  }, []);

  const checkAuthenticate = async () => {
    if (await client.isAuthenticated) {
      return;
    } else {
      router.replace("/login");
    }
  };

  const onCategoryClick = (category) => {
    router.push({
      pathname: "/category-detail",
      params: {
        categoryId: category.id,
      },
    });
  };

  const calculateTotalCost = (categoryItems) => {
    let totalCost = 0;
    categoryItems?.forEach((item) => {
      totalCost += item?.cost;
    });
    return totalCost;
  };

  return (
    <View
      style={{
        marginTop: 10,
        padding: 10,
        paddingBottom: 90,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 15,
          marginTop: 30,
          marginLeft: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
          }}
        >
          All Budgets
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getCategoryList()}
            refreshing={loading}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {categoryList?.map((category, index) => {
          const totalCost = calculateTotalCost(category?.categoryItems);

          return (
            <TouchableOpacity
              key={index}
              style={styles.container}
              onPress={() => onCategoryClick(category)}
            >
              <View style={styles.iconContainer}>
                <Text
                  style={[
                    styles.iconText,
                    { backgroundColor: category?.color },
                  ]}
                >
                  {category.icon}
                </Text>
              </View>
              <View style={styles.subcontainer}>
                <View>
                  <Text style={styles.categoryText}>{category.name}</Text>
                  <Text style={styles.itemCount}>
                    Items: {category?.categoryItems?.length}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.totalAmountText,
                      totalCost > category?.assigned_budget
                        ? styles.exceedBudget
                        : null,
                    ]}
                  >
                    Rs. <Text>{totalCost}</Text>
                  </Text>
                  {totalCost > category?.assigned_budget && (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "outfit",
                        fontSize: 8,
                      }}
                    >
                      *Budget Exceeded
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "baseline",
  },
  iconText: {
    fontSize: 35,
    padding: 16,
    borderRadius: 15,
    fontFamily: "outfit",
  },
  container: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 15,
    fontFamily: "outfit",
  },
  categoryText: {
    fontFamily: "outfit-bold",
    fontSize: 17,
  },
  itemCount: {
    fontFamily: "outfit",
  },
  subcontainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  totalAmountText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  exceedBudget: {
    color: Colors.RED,
  },
});
