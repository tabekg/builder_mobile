import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import NewProjectScreen from "./NewProjectScreen";
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {

  const navigation = useNavigation();
  return (
    <>

      <View style={{ backgroundColor: "#f1eded", flex: 2, justifyContent: "center", alignItems: "center" }}>
        <Image style={{ width: "70%", height: "20%" }} resizeMode={"contain"}
               source={require("../../assets/images/builder.png")} />
        <View style={{ width: "80%", height: "22%", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => navigation.navigate(NewProjectScreen)} style={{ backgroundColor: "#257ae7", padding: 8, elevation: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#ebefef", fontWeight: "bold" }}>Создать
              проект</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#257ae7", padding: 8, elevation: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#ebefef", fontWeight: "bold" }}>Мои
              проекты</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#257ae7", padding: 8, elevation: 10, alignItems: "center" }}>
            <Text style={{
              fontSize: 18,
              color: "#ebefef",
              fontWeight: "bold",
            }}>Настройки</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#257ae7", padding: 8, elevation: 10, alignItems: "center" }}>
            <Text style={{
              fontSize: 18,
              color: "#ebefef",
              fontWeight: "bold",
            }}>помошь</Text>
          </TouchableOpacity>
        </View>
        <Text style={{display: "flex", justifyContent: "flex-end", backgroundColor: "red"}}>d</Text>
        </View>


    </>
  );
}


export default HomeScreen;
