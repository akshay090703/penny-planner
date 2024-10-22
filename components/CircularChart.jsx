import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import PieChart from "react-native-pie-chart";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function CircularChart({ categoryList }) {
  const widthAndHeight = 150;
  const [values, setValues] = useState([]);
  const [sliceColor, setSliceColor] = useState([Colors.GRAY]);

  useEffect(() => {
    updateCircularChart();
  }, [categoryList]);

  const updateCircularChart = () => {
    const newValues = [];
    const newSliceColors = [];

    let otherCost = 0;

    categoryList?.forEach((item, index) => {
      if (index < 4) {
        let itemTotalCost = 0;
        item?.categoryItems?.forEach((item_) => {
          itemTotalCost += item_?.cost;
        });

        if (itemTotalCost > 0) {
          newSliceColors.push(Colors.COLOR_LIST[index]);
          newValues.push(itemTotalCost);
        }
      } else {
        item?.categoryItems?.forEach((item_) => {
          otherCost += item_?.cost;
        });

        if (otherCost > 0) {
          newSliceColors.push(Colors.COLOR_LIST[4]);
          newValues.push(otherCost);
        }
      }
    });

    setValues(newValues);
    setSliceColor(newSliceColors);
  };

  const totalEstimate = values.reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit",
        }}
      >
        Total Estimate:{" "}
        <Text
          style={{
            fontFamily: "outfit-bold",
          }}
        >
          Rs. {totalEstimate}
        </Text>
      </Text>
      <View style={styles.subcontainer}>
        {totalEstimate === 0 ? (
          <Text>No data available</Text> // Show this message when there's no data
        ) : (
          <PieChart
            widthAndHeight={widthAndHeight}
            series={values}
            sliceColor={sliceColor}
            coverRadius={0.65}
            coverFill={"#FFF"}
          />
        )}

        {categoryList?.length === 0 ? (
          <View style={styles.chartNameContainer}>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={24}
              color={Colors.GRAY}
            />
            <Text>N/A</Text>
          </View>
        ) : (
          <View>
            {categoryList?.map(
              (category, index) =>
                index <= 4 && (
                  <View key={index} style={styles.chartNameContainer}>
                    <MaterialCommunityIcons
                      name="checkbox-blank-circle"
                      size={24}
                      color={Colors.COLOR_LIST[index]}
                    />
                    <Text>{index < 4 ? category?.name : "Other"}</Text>
                  </View>
                )
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  subcontainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  chartNameContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
