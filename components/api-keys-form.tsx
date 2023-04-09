import { useScarlettStore } from "../lib/store";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { Text } from "./text";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";

export const ApiKeysForm = () => {
  const setSecrets = useScarlettStore((a) => a.setSecrets);
  const [openAi, setOpenAi] = useState("");
  const [elevenLabs, setElevenLabs] = useState("");

  return (
    <View
      style={{
        gap: 12,
        padding: 24,
      }}
    >
      <Text style={{ marginBottom: 24, textAlign: "center" }}>
        This app needs two api keys to function. Those will be kept in your
        device secured storage and never uploaded.
      </Text>
      <Text>OpenAI</Text>
      <TextInput
        style={styles.textInput}
        value={openAi}
        onChangeText={(t) => setOpenAi(t)}
      />
      <Text>Elevenlabs</Text>
      <TextInput
        style={styles.textInput}
        value={elevenLabs}
        onChangeText={(t) => setElevenLabs(t)}
      />
      <Button
        title="OK"
        onPress={async () => {
          await SecureStore.setItemAsync("OPENAI_API_KEY", openAi);
          await SecureStore.setItemAsync("ELEVENLABS_API_KEY", elevenLabs);

          setSecrets({
            openAi,
            elevenLabs,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 8,
    borderColor: "gray",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
});
