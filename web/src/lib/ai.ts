import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

type Provider = 'google' | 'openai' | 'custom' | 'deepseek' | 'moonshot';

interface AIConfig {
  provider: Provider;
  apiKey: string;
  baseUrl?: string;
  modelName: string;
}

function getConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'google') as Provider;
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
  const baseUrl = process.env.AI_BASE_URL;
  let modelName = process.env.AI_MODEL_NAME || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  
  // Default models if not specified
  if (!modelName && provider === 'openai') modelName = 'gpt-4-turbo';
  if (!modelName && provider === 'deepseek') modelName = 'deepseek-chat';
  if (!modelName && provider === 'moonshot') modelName = 'moonshot-v1-8k';

  return { provider, apiKey, baseUrl, modelName };
}

export async function generateContentStream(prompt: string) {
  const config = getConfig();

  if (!config.apiKey) {
    throw new Error("Missing AI_API_KEY environment variable.");
  }

  // 1. Google Gemini
  if (config.provider === 'google') {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.modelName });
    const result = await model.generateContentStream(prompt);
    
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });
  }

  // 2. OpenAI SDK Compatible Providers
  let baseURL = config.baseUrl;
  if (!baseURL) {
    if (config.provider === 'deepseek') baseURL = 'https://api.deepseek.com';
    if (config.provider === 'moonshot') baseURL = 'https://api.moonshot.cn/v1';
  }

  const openai = new OpenAI({
    apiKey: config.apiKey,
    baseURL: baseURL,
    dangerouslyAllowBrowser: true 
  });

  const stream = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: config.modelName,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
      }
      controller.close();
    },
  });
}

export async function generateContent(prompt: string): Promise<string> {
  const config = getConfig();

  if (!config.apiKey) {
    throw new Error("Missing AI_API_KEY environment variable.");
  }

  if (config.provider === 'google') {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: config.modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  let baseURL = config.baseUrl;
  if (!baseURL) {
    if (config.provider === 'deepseek') baseURL = 'https://api.deepseek.com';
    if (config.provider === 'moonshot') baseURL = 'https://api.moonshot.cn/v1';
  }

  const openai = new OpenAI({
    apiKey: config.apiKey,
    baseURL: baseURL,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: config.modelName,
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("AI SDK Error:", error);
    throw error;
  }
}
