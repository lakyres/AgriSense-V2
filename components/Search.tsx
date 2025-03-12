import { Text, View, Image } from "react-native"
import React from "react";
import {usePathname} from "expo-router";

const Search = () => {
    const pathname = usePathname();
  return (
    <View>
      <Text>Search</Text>
    </View>
  )
}
export default Search;
