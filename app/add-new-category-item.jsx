import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/SuperbaseConfig";
import { decode } from "base64-arraybuffer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { client } from "../utils/kindeConfig";

const placeholder =
  "https://conference.nbasbl.org/wp-content/uploads/2022/05/placeholder-image-1.png";
export default function AddNewCategoryItem() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();

  const [image, setImage] = useState(
    "iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAMAAADaaRXwAAAAkFBMVEXY2Nimpqa+vr7ExMS8vLzJycm6urq5ubnX19etra3T09Ourq7W1tbU1NTS0tKsrKyvr6/R0dHQ0NCxsbGwsLCrq6vNzc20tLTV1dXFxcWysrLOzs7Dw8O9vb2qqqrGxsa7u7vAwMCpqanKysq2trbIyMizs7O1tbXPz8+/v7/BwcHMzMyoqKi3t7e4uLjCwsLnzYKKAAADBElEQVR4XuzAMQEAAADCIPunNsYeWAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODs3etu2kAQR/EOScj6BgXMxZhrEtJc2/d/u1baD5PESnaRPNpKOecR+AkkxoK/a0/NhUHNqXUAnF15nItZ82MJwHlNMzEtmwJwTpMbMe5mAkB8rhDzCgdAdBuxTzYARFeIffITgNhy8c22A4O2M/HlAES28B61s/F2tQdZABDZrQc5WIEfPMgtAJFdeZBLK5BLD3IFwDcBAQQQQACp9o+Hwebh/wABpF2KL9u75CCAuIFo91ViEEDcb3lblqcFAeRR3jcrU4IA0srHjilBAFl2QF6qdCCAVNKtSQcCyF66vaYDAeRRutUBgIflygoEkKF0Gwc8dlKvjEAAuZRuxZce052IzFY2IIA8Sbd1yMOLWIAA8izdtl95zEVUpHcQQNxOOi2CHl7EAoTTydM5n1iTuWjr0gAEkDKLfIOoh4oYgHBcnL7Iuy7CHipiAMLzkMVONPnzucdYPnZfGoDwxHCkB8bs9lOPkXp0RHoBAUR7Ho5F5OaucbEeKtInCCCaq/SlDXtoy9IABJBQo0wkLGIPAoh6xIrYgwCSZ/JVv5wxCCDxHipiDwKIesSK2IMAkhcS7s7ZgAAyWY/O8lARCxBAJmMZvxOp1CMk0isIIHoeyd6IVD8ltlfXHwgg6qEi6hHXoF8QQPQ8kuXqEd91XyCA6HlERbxHAhBA1EMr/olUtSQCAUTPIyqyqiURCCDqoRW1JAABJPD1LwUIIOqRHgQQ9UgPAoieR9KDANI9j6QHAUQ90oMAoh7pQQAJeaQH4Sdt6UEAuQYEEAIkECAECCAEiGmApA8QQPbD3tp/TxD+SBkQQAABBBAGXYjJI0bBiNm882NYkpheZZyYmO/uLwbuybWn5sKg5tS6v+3AMQEAAADCIPunNsYeWAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBrNTMp6EjJUwAAAABJRU5ErkJggg=="
  );
  const [previewImage, setPrevewImage] = useState(placeholder);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");
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

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
      base64: true,
    });

    // console.log(result);

    if (!result.canceled) {
      setPrevewImage(result.assets[0].uri);
      setImage(result.assets[0].base64);
    } else {
      ToastAndroid.show(
        "Please upload a image for the item!",
        ToastAndroid.LONG
      );
    }
  };

  const onClickAdd = async () => {
    setLoading(true);
    const fileName = Date.now();

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName + ".png", decode(image), {
        contentType: "image/png",
      });

    if (data) {
      const fileUrl = `https://ikmarhflyefqprfjnzwd.supabase.co/storage/v1/object/public/images/${fileName}.png`;

      const { data, error } = await supabase
        .from("categoryItems")
        .insert([
          {
            name: name,
            cost: cost,
            url: url,
            image: fileUrl,
            note: note,
            category_id: categoryId,
          },
        ])
        .select();

      if (data) {
        ToastAndroid.show("New Item Added!!", ToastAndroid.SHORT);

        router.replace({
          pathname: "/category-detail",
          params: {
            categoryId: categoryId,
          },
        });
      } else {
        ToastAndroid.show(
          "Error storing details in the DB!",
          ToastAndroid.LONG
        );
      }
    } else {
      ToastAndroid.show("Error storing image in DB!", ToastAndroid.LONG);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView
        style={{
          padding: 20,
          backgroundColor: Colors.WHITE,
        }}
      >
        <TouchableOpacity onPress={() => onImagePick()}>
          <Image source={{ uri: previewImage }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <Ionicons name="pricetag" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Item Name"
            style={styles.input}
            onChangeText={(val) => setName(val)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <FontAwesome name="dollar" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Item Price"
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={(val) => setCost(val)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Entypo name="link" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Url"
            style={styles.input}
            onChangeText={(val) => setUrl(val)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Foundation name="clipboard-notes" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder="Note"
            style={styles.input}
            numberOfLines={3}
            onChangeText={(val) => setNote(val)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          disabled={!name || !cost || loading}
          onPress={() => onClickAdd()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} size={"small"} />
          ) : (
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "outfit-bold",
                color: Colors.WHITE,
              }}
            >
              Add Item
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    backgroundColor: Colors.GRAY,
    borderRadius: 15,
    objectFit: "contain",
    marginHorizontal: "auto",
  },
  textInputContainer: {
    padding: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: Colors.BLACK,
    marginTop: 15,
  },
  input: {
    fontSize: 17,
    fontFamily: "outfit",
    width: "100%",
  },
  button: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    marginTop: 25,
  },
});
