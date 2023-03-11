import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SpeechToText from "./components/SpeechToText";

export default function App() {
  return (
    <View style={styles.container}>
      <SpeechToText></SpeechToText>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
