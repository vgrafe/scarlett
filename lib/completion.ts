export const callChatGPTWithConvo = async (
  messages: ChatCompletionRequestMessage[],
  openAiKey: string
) => {
  const req = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
    }),
  });

  return req.json();
};
