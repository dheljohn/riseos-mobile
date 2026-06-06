import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { colors } from "../styles/theme";

type Props = {
  visible: boolean;
  url: string;
  onClose: () => void;
};

export default function WebModal({ visible, url, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={StyleSheet.absoluteFill}
            />
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  close: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  webview: {
    flex: 1,
  },
});
