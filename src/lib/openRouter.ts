

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

export async function sendMessageToOpenRouter(messages: any[]) {
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
        model: 'qwen/qwen2.5-vl-72b-instruct:free',
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
