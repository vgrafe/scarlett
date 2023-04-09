import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { callWhisperWithAudioUrl } from "../lib/voice-to-text";
import { callChatGPTWithConvo } from "../lib/completion";
import {
  callElevenLabsWithText,
  sayWithSystemSpeech,
} from "../lib/text-to-speech";
import { playSound, useRecorder } from "../lib/audio";
import { systemPrompt } from "../lib/systemPrompt";
// import { TapGestureHandler } from "react-native-gesture-handler";
// import Animated, {
//   runOnJS,
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";
import { welcomeText } from "../lib/welcomeText";
import { Text } from "./text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useScarlettStore } from "lib/store";

const USE_ELEVENLABS = true;

const CHATGPT_35_COST_PER_TOKEN = 0.000002;
const WHISPER_COST_PER_MINUTE = 0.006;

export const Recorder = () => {
  const [totalCost, setTotalCost] = useState(0);

  const secrets = useScarlettStore((a) => a.secrets);

  useEffect(() => {
    const loadTokenUse = async () => {
      const tokenUse = await AsyncStorage.getItem("totalCost");
      setTotalCost(parseInt(tokenUse) || 0);
    };
    loadTokenUse();
  }, []);

  console.log({
    totalCost,
  });

  const [status, setStatus] = useState<"ready" | "thinking" | "speaking">(
    "ready"
  );

  const [chatLines, setChatLines] = useState<ChatCompletionRequestMessage[]>([
    {
      role: "system",
      content: systemPrompt,
    },
  ]);

  const { startRecording, stopRecording, recording } = useRecorder({
    onSoundRecorded: async (recording, minutes) => {
      const whisperCost = minutes * WHISPER_COST_PER_MINUTE;
      await AsyncStorage.setItem(
        "totalCost",
        (totalCost + whisperCost).toString()
      );
      setTotalCost((t) => t + whisperCost);

      setStatus("thinking");
      const uri = recording.getURI();

      const transcription = await callWhisperWithAudioUrl(uri, secrets.openAi);

      const newChatLine = {
        role: "user",
        content: transcription,
      } satisfies ChatCompletionRequestMessage;

      const newChatLines = [...chatLines, newChatLine];

      setChatLines(newChatLines);

      const gptAnswer = await callChatGPTWithConvo(
        newChatLines,
        secrets.openAi
      );
      const response = gptAnswer.choices[0].message.content;

      const gptCost = Math.round((totalCost * CHATGPT_35_COST_PER_TOKEN) / 100);

      await AsyncStorage.setItem("totalCost", (totalCost + gptCost).toString());
      setTotalCost((t) => t + gptCost);

      setChatLines((c) => [...c, { role: "assistant", content: response }]);

      if (USE_ELEVENLABS) {
        const audioBlob = await callElevenLabsWithText(
          response,
          secrets.elevenLabs
        );
        setStatus("speaking");
        await playSound(audioBlob);
        setStatus("ready");
      } else sayWithSystemSpeech(response);
    },
  });

  // fuck reanimated

  // const eventHandler = useAnimatedGestureHandler({
  //   onStart: (event, ctx) => {
  //     if (status === "ready") {
  //       pressed.value = true;
  //       runOnJS(startRecording)();
  //     }
  //   },
  //   onEnd: (event, ctx) => {
  //     if (status === "ready") {
  //       pressed.value = false;
  //       runOnJS(stopRecording)();
  //     }
  //   },
  // });
  // const uas = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: withSpring(pressed.value ? "#F00F86" : "#001972"),
  //     transform: [{ scale: withSpring(pressed.value ? 1.2 : 1) }],
  //   };
  // });

  const lastLine = chatLines.filter((a) => a.role !== "system").at(-1)?.content;

  return (
    <View style={styles.view}>
      <ScrollView>
        {lastLine ? (
          <Text>{lastLine}</Text>
        ) : (
          <View style={{ gap: 32 }}>
            {welcomeText.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </View>
        )}
      </ScrollView>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: recording
              ? "rgba(255,0,0,0.5)"
              : "rgba(255,0,0,0.25)",
          },
        ]}
        onTouchStart={() => {
          if (status === "ready") startRecording();
        }}
        onTouchEnd={() => {
          if (status === "ready") stopRecording();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: "100%",
    width: "100%",
    paddingHorizontal: "10%",
    paddingVertical: "25%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    opacity: 0.75,
    height: 200,
    width: 200,
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    color: "white",
  },
});
