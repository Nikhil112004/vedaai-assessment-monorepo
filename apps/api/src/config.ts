import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  frontendUrls: process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  groqApiUrl: process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;
