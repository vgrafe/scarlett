# Scarlett

Spoken conversational experience for mobile devices, made with [Expo](https://expo.dev/).

I wanted to fiddle with OpenAI [whisper](https://platform.openai.com/docs/api-reference/audio/create) and [gpt](https://platform.openai.com/docs/api-reference/chat/create), and plug [elevenlabs speech synthesis](https://beta.elevenlabs.io/speech-synthesis) on top of it. This has probably been done way better, but I wanted do put something fun together.

This is a pretty rough POC but good enough to work and see some initial areas of improvement:

- I want to explore a more conversational experience without having to press a button but this is not as easy as it sounds. This would enable the user to cut off the bot as it is answering which could lead to a pretty fun UX for role playing.
- the latency must go. There are a few avenues to do so e.g. running the models on device.
