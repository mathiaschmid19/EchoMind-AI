import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface StructuredOutputSchema {
  name: string;
  strict: boolean;
  schema: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
    }>;
    required: string[];
    additionalProperties: boolean;
  };
}

interface UseOpenRouterReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, schema?: StructuredOutputSchema) => Promise<void>;
  clearMessages: () => void;
}

export const useOpenRouter = (): UseOpenRouterReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = async (content: string, schema?: StructuredOutputSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const newMessages = [...messages, { role: "user" as "user", content }];
      setMessages(newMessages);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4",
          messages: newMessages,
          ...(schema && {
            response_format: {
              type: "json_schema",
              json_schema: schema,
            },
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;

      setMessages([...newMessages, assistantMessage]);

      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, isLoading, error, sendMessage, clearMessages };
}; 