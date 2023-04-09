import { Recorder } from "./components/recorder";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useScarlettStore } from "./lib/store";
import { ApiKeysForm } from "./components/api-keys-form";

export default function App() {
  let colorScheme = useColorScheme();
  const secrets = useScarlettStore((s) => s.secrets);

  const showForm = !secrets.elevenLabs || !secrets.openAi;

  return (
    <View style={[styles.container, styles[colorScheme]]}>
      {showForm ? <ApiKeysForm /> : <Recorder />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dark: {
    backgroundColor: "#000010",
  },
  light: {
    backgroundColor: "#eeeef0",
  },
});
