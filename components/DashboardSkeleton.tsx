import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/theme";

const { width } = Dimensions.get("window");

function SkeletonBlock({
  width: w,
  height: h,
  borderRadius = 8,
  style,
  anim,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
  anim: Animated.Value;
}) {
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.55],
  });

  return (
    <Animated.View
      style={[
        {
          width: w as any,
          height: h,
          borderRadius,
          backgroundColor: "#2a2a2a",
          opacity,
        },
        style,
      ]}
    />
  );
}

function SkeletonCard({ anim }: { anim: Animated.Value }) {
  return (
    <View style={styles.cardContainer}>
      {/* leftSection */}
      <View style={styles.leftSection}>
        {/* iconContainer */}
        <SkeletonBlock anim={anim} width={36} height={36} borderRadius={10} />
        {/* textContainer */}
        <View style={styles.textContainer}>
          <SkeletonBlock anim={anim} width={50} height={10} borderRadius={4} />
          <SkeletonBlock
            anim={anim}
            width={70}
            height={18}
            borderRadius={5}
            style={{ marginTop: 5 }}
          />
          <SkeletonBlock
            anim={anim}
            width={55}
            height={9}
            borderRadius={4}
            style={{ marginTop: 4 }}
          />
        </View>
      </View>
      {/* chevron */}
      <SkeletonBlock anim={anim} width={16} height={16} borderRadius={4} />
    </View>
  );
}

export default function DashboardSkeleton() {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 90,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileBlock}>
          <SkeletonBlock anim={anim} width={80} height={10} borderRadius={4} />
          <SkeletonBlock
            anim={anim}
            width={160}
            height={22}
            borderRadius={6}
            style={{ marginTop: 8 }}
          />
        </View>
        {/* Logout icon placeholder */}
        <SkeletonBlock anim={anim} width={40} height={40} borderRadius={50} />
      </View>

      {/* Streak Card */}
      <View style={styles.cardStreak}>
        <SkeletonBlock anim={anim} width={90} height={10} borderRadius={4} />
        <View style={styles.row}>
          <View style={styles.streakStat}>
            <SkeletonBlock
              anim={anim}
              width={48}
              height={32}
              borderRadius={6}
            />
            <SkeletonBlock
              anim={anim}
              width={60}
              height={8}
              borderRadius={4}
              style={{ marginTop: 6 }}
            />
          </View>

          <View style={styles.streakStat}>
            <SkeletonBlock
              anim={anim}
              width={48}
              height={32}
              borderRadius={6}
            />
          </View>
        </View>
      </View>

      {/* TODAY label */}
      <SkeletonBlock
        anim={anim}
        width={55}
        height={10}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />

      {/* Sleep, Meals, Focus cards — all match SleepCard layout */}
      <SkeletonCard anim={anim} />
      <SkeletonCard anim={anim} />
      <SkeletonCard anim={anim} />

      <SkeletonBlock
        anim={anim}
        width={55}
        height={10}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />

      {/* Patterns Card */}
      <View style={styles.card}>
        <SkeletonBlock
          anim={anim}
          width={100}
          height={10}
          borderRadius={4}
          style={{ marginBottom: 12 }}
        />
        <SkeletonBlock
          anim={anim}
          width="100%"
          height={10}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
        <SkeletonBlock
          anim={anim}
          width="88%"
          height={10}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
        <SkeletonBlock anim={anim} width="75%" height={10} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  profileBlock: {
    gap: 0,
  },
  cardContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // gap: 16,
    marginBottom: 12,
  },
  cardStreak: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textContainer: {
    gap: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  streakStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#2a2a2a",
    alignSelf: "stretch",
  },
});
