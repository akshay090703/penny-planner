import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { client } from "../../utils/kindeConfig";
import { supabase } from "../../utils/SuperbaseConfig";
import Header from "../../components/Header";
import { Colors } from "@/constants/Colors";
import CircularChart from "../../components/CircularChart";
import Ionicons from "@expo/vector-icons/Ionicons";
import CategoryList from "../../components/CategoryList";

export default function Index() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState();
  const [loading, setLoading] = useState(false);

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

  const getCategoryList = async () => {
    setLoading(true);
    const userProfile = await client.getUserDetails();

    const { data, error } = await supabase
      .from("category")
      .select("*,categoryItems(*)")
      .eq("created_by", userProfile.email);

    // console.log("Data: ", data);

    setCategoryList(data.reverse());
    data && setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getCategoryList()}
            refreshing={loading}
          />
        }
      >
        <View
          style={{
            padding: 20,
            backgroundColor: Colors.PRIMARY,
            height: 170,
          }}
        >
          <Header />
        </View>
        <View
          style={{
            padding: 20,
            marginTop: -100,
          }}
        >
          <CircularChart categoryList={categoryList} />

          <CategoryList categoryList={categoryList} />
        </View>
      </ScrollView>
      <Link style={styles.addBtnContainer} href={"/add-new-category"}>
        <Ionicons name="add-circle" size={64} color={Colors.PRIMARY} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  addBtnContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
