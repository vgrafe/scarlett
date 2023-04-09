interface ChatCompletionRequestMessage {
  role: "user" | "assistant" | "system";
  content: string;
  name?: string;
}
