import { LOG_LEVEL } from '../enums/index.js';

export interface FormatterPayload {
  level: LOG_LEVEL;
  args: any[];
  options?: {
    name?: string;
    timestamp?: Date;
  };
}

export interface FormatterOption {
  color: boolean;
}

export interface Formatter {
  format(payload: FormatterPayload): string;
}
