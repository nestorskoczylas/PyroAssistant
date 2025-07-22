// storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  TIR_LINES: 'tirLines',
  SETTINGS: 'settings',
};
