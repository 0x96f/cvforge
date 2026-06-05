import { env } from '$env/dynamic/public';

export const GITHUB_URL = env.PUBLIC_GITHUB_URL ?? 'https://github.com/0x96f/CVForge';
export const STORAGE_KEY = 'cvfrg:v1';
export const DEK_STORAGE_KEY = 'cvfrg:dek';
