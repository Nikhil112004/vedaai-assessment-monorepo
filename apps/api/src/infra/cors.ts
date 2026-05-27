import type { CorsOptions } from 'cors';
import { config } from '../config';

const trimTrailingSlash = (value: string): string => value.trim().replace(/\/+$/, '');

const configuredOrigins = config.frontendUrls
  .split(',')
  .map(trimTrailingSlash)
  .filter(Boolean);

const allowVercelAppOrigins = configuredOrigins.some((origin) => origin.endsWith('.vercel.app'));

const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = trimTrailingSlash(origin);
  const isExactMatch = configuredOrigins.includes(normalizedOrigin);
  const isVercelPreviewMatch = allowVercelAppOrigins && normalizedOrigin.endsWith('.vercel.app');

  return isExactMatch || isVercelPreviewMatch;
};

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
};

export const socketCorsOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void => {
  callback(null, isAllowedOrigin(origin));
};

