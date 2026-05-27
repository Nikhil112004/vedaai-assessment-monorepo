import IORedis from 'ioredis';
import { config } from '../config';

const redisConnectionOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const redis = new IORedis(config.redisUrl, redisConnectionOptions);

export const shutdownRedis = async (): Promise<void> => {
  await redis.quit();
};
