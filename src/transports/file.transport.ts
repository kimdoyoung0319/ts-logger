import { Transport, TransportOptions, TransportPayload } from './transport.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SimpleFormatter } from '../formatters/simple.formatter.js';

type LOG_ROTATION = 'daily' | 'weekly' | 'monthly';

export interface FileTransportOptions extends TransportOptions {
  path: string;
  logRotation?: LOG_ROTATION;
}

export class FileTransport extends Transport {
  constructor(private readonly fileOptions: FileTransportOptions) {
    // If the user did not specified the formatter, defaults to `SimpleFormatter` without color
    // since colored log level won't be properly displayed when the pager or editor does not support
    // ANSI colors.
    if (fileOptions.formatter === undefined) {
      fileOptions.formatter = new SimpleFormatter({ color: false });
    }

    super(fileOptions);
  }

  handle({ message }: TransportPayload): void {
    let filePath = this.fileOptions.path;

    if (this.fileOptions.logRotation) {
      const date = new Date();
      switch (this.fileOptions.logRotation) {
        case 'daily':
          filePath = join(
            filePath,
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`
          );
          break;
        case 'weekly':
          const weekNumber = Math.ceil(date.getDate() / 7);
          filePath = join(filePath, `${date.getFullYear()}-W${weekNumber}.log`);
          break;
        case 'monthly':
          filePath = join(filePath, `${date.getFullYear()}-${date.getMonth() + 1}.log`);
          break;
      }
    }

    writeFileSync(filePath, `${message}\n`, { flag: 'a' });
  }
}
