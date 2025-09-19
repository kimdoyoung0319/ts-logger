import { LOG_LEVEL } from '../enums/index.js';
import { SimpleFormatter } from '../formatters/index.js';
import { Formatter } from '../interfaces/formatter.js';

export interface TransportOptions {
  formatter?: Formatter;
  threshold?: LOG_LEVEL;
}

export interface TransportPayload {
  message: string;
}

export abstract class Transport {
  constructor(options?: TransportOptions) {
    this.options = options || {};
    this.options.formatter = this.options.formatter || new SimpleFormatter();
    this.options.threshold = this.options.threshold || LOG_LEVEL.DEBUG;
  }

  public options: TransportOptions;
  abstract handle(payload: TransportPayload): void;
}
