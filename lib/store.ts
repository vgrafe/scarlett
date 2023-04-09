import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface Secrets {
  openAi: string;
  elevenLabs: string;
}

interface Store {
  secrets: Secrets;
  setSecrets: (secrets: Secrets) => void;
}

export const useScarlettStore = create<Store>((set) => ({
  secrets: {
    openAi: null,
    elevenLabs: null,
  },
  setSecrets: (secrets) => set(() => ({ secrets })),
}));

const initialLoad = async () => {
  const OPENAI_API_KEY = await SecureStore.getItemAsync("OPENAI_API_KEY");
  const ELEVENLABS_API_KEY = await SecureStore.getItemAsync(
    "ELEVENLABS_API_KEY"
  );

  useScarlettStore.setState({
    secrets: {
      openAi: OPENAI_API_KEY,
      elevenLabs: ELEVENLABS_API_KEY,
    },
  });
};

initialLoad();
