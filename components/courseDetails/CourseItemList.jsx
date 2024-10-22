import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { supabase } from "../../utils/SuperbaseConfig";

export default function CourseItemList({ categoryData, setUpdateRecord }) {
  const [expandItem, setExpandItem] = useState();

  const handleOpenURL = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        ToastAndroid.show("Invalid URL: " + url, ToastAndroid.LONG)
      );
    }
  };

  // const onDeleteItem = async (id) => {
  //   const { error } = await supabase
  //     .from("categoryItems")
  //     .delete()
  //     .eq("id", id);

  //   if (!error) {
  //     ToastAndroid.show("Item Deleted!", ToastAndroid.SHORT);
  //   } else {
  //     ToastAndroid.show("Error deleting item!", ToastAndroid.LONG);
  //     setUpdateRecord(true);
  //   }
  // };

  const onDeleteItem = (id) => {
    Alert.alert("Are You Sure", "Do you want to delete this Item?", [
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
            .eq("id", id);

          if (!error) {
            // console.error(error);
            ToastAndroid.show("Item Deleted!", ToastAndroid.SHORT);
            setUpdateRecord(true);
          } else {
            ToastAndroid.show("Error deleting item!", ToastAndroid.LONG);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Items List</Text>

      <View style={{ marginTop: 15 }}>
        {categoryData?.categoryItems?.length > 0 ? (
          categoryData?.categoryItems?.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => setExpandItem(index)}
              >
                <Image source={{ uri: item?.image }} style={styles.image} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{item?.name}</Text>
                  <TouchableOpacity onPress={() => handleOpenURL(item?.url)}>
                    <Text style={styles.urlText}>Visit Item Site</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cost}>Rs. {item.cost}</Text>
              </TouchableOpacity>

              {expandItem == index && (
                <View style={styles.actionItemContainer}>
                  <TouchableOpacity onPress={() => onDeleteItem(item?.id)}>
                    <EvilIcons name="trash" size={34} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleOpenURL(item?.url)}>
                    <EvilIcons name="external-link" size={34} color="blue" />
                  </TouchableOpacity>
                </View>
              )}
              {categoryData?.categoryItems?.length - 1 != index && (
                <View
                  style={{
                    borderWidth: 0.5,
                    marginTop: 10,
                    borderColor: Colors.GRAY,
                  }}
                ></View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>No Items Found!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  heading: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  urlText: {
    color: Colors.PRIMARY,
    textDecorationLine: "underline",
    fontFamily: "outfit",
    fontSize: 14,
  },
  name: { fontSize: 20, fontFamily: "outfit-bold" },
  cost: {
    fontSize: 17,
    fontFamily: "outfit-bold",
    marginLeft: 10,
  },
  noItemsText: {
    fontFamily: "outfit-bold",
    fontSize: 25,
    color: Colors.GRAY,
  },
  actionItemContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
});
