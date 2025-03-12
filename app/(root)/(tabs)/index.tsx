import { Text, View, Image } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";

export default function Index() {
  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={images.avatar} style={{ width: 48, height: 48, borderRadius: 24 }} />
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8, justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, fontFamily: 'Rubik', color: '#666' }}>Good Morning</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Rubik-Medium', color: '#333' }}>Kyla Marjes</Text>
            </View>
          </View>
          <Image source={icons.bell} style={{ width: 24, height: 24 }} />
        </View>
      </View>
      <Search />
    </SafeAreaView>
  );
}