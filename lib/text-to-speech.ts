import * as Speech from "expo-speech";

export const callElevenLabsWithText = async (
  text: string,
  elevenLabsKey: string
) => {
  const res = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/TxGEqnHWrfWFTfGW9XjX/stream",
    {
      method: "POST",
      headers: {
        accept: "audio/mpeg",
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
        },
      }),
    }
  );

  return res.blob();
};

export const sayWithSystemSpeech = (text: string) => {
  Speech.speak(text);
};
