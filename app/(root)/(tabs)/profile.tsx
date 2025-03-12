import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: object;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Image source={icon} style={{ width: 24, height: 24 }} />
      <Text style={[{ fontSize: 18, fontFamily: 'Rubik-Medium', color: '#333' }, textStyle]}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} style={{ width: 20, height: 20 }} />}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Success", "Logged out successfully");
      refetch({});
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 28 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Rubik-Bold' }}>Profile</Text>
          <Image source={icons.bell} style={{ width: 20, height: 20 }} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
            <Image
              source={{ uri: user?.avatar }}
              style={{ width: 176, height: 176, borderRadius: 88 }}
            />
            <TouchableOpacity style={{ position: 'absolute', bottom: 44, right: 8 }}>
              <Image source={icons.edit} style={{ width: 36, height: 36 }} />
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontFamily: 'Rubik-Bold', marginTop: 8 }}>{user?.name}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'column', marginTop: 40 }}>
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        <View style={{ flexDirection: 'column', marginTop: 20, borderTopWidth: 1, paddingTop: 20, borderColor: '#0061FF1A' }}>
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View style={{ flexDirection: 'column', borderTopWidth: 1, marginTop: 20, paddingTop: 20, borderColor: '#0061FF1A' }}>
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle={{ color: '#FF0000' }}
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;