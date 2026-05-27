// // components/BottomNav.tsx
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigate } from "../lib/useNavigate";
// import { usePathname } from "expo-router";
// import { colors } from "../styles/theme";

// const NAV_ITEMS = [
//   {
//     label: "Home",
//     icon: "home-outline",
//     activeIcon: "home",
//     route: "/(dashboard)",
//   },
//   {
//     label: "Sleep",
//     icon: "moon-outline",
//     activeIcon: "moon",
//     route: "/(dashboard)/sleep",
//   },
//   {
//     label: "Focus",
//     icon: "timer-outline",
//     activeIcon: "timer",
//     route: "/(dashboard)/focus",
//   },
//   {
//     label: "Meals",
//     icon: "restaurant-outline",
//     activeIcon: "restaurant",
//     route: "/(dashboard)/meals",
//   },
// ] as const;

// export default function BottomNav() {
//   const { navigate } = useNavigate();
//   const pathname = usePathname();

//   function isActive(route: string) {
//     if (route === "/(dashboard)")
//       return pathname === "/" || pathname === "/index";
//     return pathname.includes(route.replace("/(dashboard)/", ""));
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.nav}>
//         {NAV_ITEMS.map((item) => {
//           const active = isActive(item.route);
//           return (
//             <TouchableOpacity
//               key={item.label}
//               style={styles.navItem}
//               onPress={() => navigate(item.route)}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
//                 <Ionicons
//                   name={active ? item.activeIcon : item.icon}
//                   size={20}
//                   color={active ? colors.accent : colors.iconDefault}
//                 />
//               </View>
//               <Text style={[styles.label, active && styles.labelActive]}>
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: 24,
//     left: 20,
//     right: 20,
//     alignItems: "center",
//   },
//   nav: {
//     flexDirection: "row",
//     backgroundColor: colors.bgCard,
//     borderRadius: 32,
//     borderWidth: 1,
//     borderColor: colors.border,
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     gap: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     gap: 4,
//   },
//   iconWrap: {
//     width: 40,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconWrapActive: {
//     backgroundColor: colors.accentBg,
//   },
//   label: {
//     fontSize: 10,
//     color: colors.iconDefault,
//     fontWeight: "500",
//   },
//   labelActive: {
//     color: colors.accent,
//     fontWeight: "700",
//   },
// });
