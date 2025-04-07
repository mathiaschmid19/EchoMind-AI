
export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
  created: number;
  model: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

export const availableModels: ModelOption[] = [
  {
    id: 'qwen/qwen2.5-vl-72b-instruct:free',
    name: 'Qwen 2.5',
    description: 'Alibaba\'s visual language model'
  },
  {
    id: 'meta-llama/llama-4-maverick:free',
    name: 'Llama 4',
    description: 'Meta\'s latest Llama model'
  },
  {
    id: 'google/gemini-2.5-pro-exp-03-25:free',
    name: 'Gemini 2.5',
    description: 'Google\'s multimodal model'
  },
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat',
    description: 'DeepSeek\'s conversation model'
  }
];

export async function sendMessageToOpenRouter(messages: any[], modelId: string) {
  const API_KEY = localStorage.getItem('openrouter_api_key');
  
  if (!API_KEY) {
    throw new Error("OpenRouter API key not found. Please add your API key.");
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Qwen Clone'
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message to OpenRouter');
    }

    return await response.json() as OpenRouterResponse;
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    throw error;
  }
}
