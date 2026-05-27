import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "../../styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" backgroundColor={colors.bg} />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            zIndex: 10,
            position: "absolute",
            bottom: insets.bottom + 16,
            borderRadius: 32,
            backgroundColor: colors.bgCard,
            width: "90%",
            marginHorizontal: "5%",
            borderWidth: 1,
            // borderTopWidth: 0,
            borderColor: colors.border,
            height: 64,
            elevation: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.iconDefault,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            marginBottom: 1,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sleep"
          options={{
            title: "Sleep",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "moon" : "moon-outline"}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            title: "Focus",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "timer" : "timer-outline"}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="meals"
          options={{
            title: "Meals",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome name="cutlery" size={18} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Top fade — hides content scrolling under status bar */}
      <LinearGradient
        colors={[colors.bg, colors.bg, `${colors.bg}cc`, "transparent"]}
        locations={[0, 0.4, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + 24,
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Bottom fade */}
      <LinearGradient
        colors={["transparent", "#060709dd", "#060709f8", colors.bg, colors.bg]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: insets.bottom + 100,
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    </View>
  );
}
