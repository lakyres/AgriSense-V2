import { Tabs } from "expo-router";
import { Image, Text, View, ImageSourcePropType } from "react-native";
import icons from "@/constants/icons";
import { useThemeContext } from "@/lib/ThemeProvider";

const TabIcon = ({
  focused,
  icon,
  title,
  isDarkMode,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
  isDarkMode: boolean;
}) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 16, // ✅ adds breathing room from the top
    }}
  >
    <Image
      source={icon}
      style={{
        tintColor: focused
          ? isDarkMode ? "#86efac" : "#16A34A"
          : isDarkMode ? "#9CA3AF" : "#666876",
        width: 24,
        height: 24,
        resizeMode: "contain",
        marginBottom: 2,
      }}
    />
    <Text
      style={{
        color: focused
          ? isDarkMode ? "#86efac" : "#16A34A"
          : isDarkMode ? "#9CA3AF" : "#666876",
        fontFamily: focused ? "Rubik-Medium" : "Rubik-Regular",
        fontSize: 11,
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {title}
    </Text>
  </View>
);

export default function TabsLayout() {
  const { isDarkMode } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#111827" : "white",
          borderTopColor: isDarkMode ? "#374151" : "#D1FAE5",
          borderTopWidth: 1,
          height: 72, // ✅ adjusted for breathing room
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.calendar} title="History" isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Scan" isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="About" isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.settings} title="Settings" isDarkMode={isDarkMode} />
          ),
        }}
      />
    </Tabs>
  );
}