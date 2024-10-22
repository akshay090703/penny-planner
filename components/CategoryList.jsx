import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function CategoryList({ categoryList }) {
  const router = useRouter();

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
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          marginBottom: 10,
        }}
      >
        Latest Budget
      </Text>
      <View>
        {categoryList?.map((category, index) => {
          const totalCost = calculateTotalCost(category?.categoryItems);

          return (
            index <= 3 && (
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
            )
          );
        })}
      </View>
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
