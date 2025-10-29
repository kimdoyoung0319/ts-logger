import { Formatter, FormatterPayload } from '../interfaces/index.js';
import { colorize, getTimeStamp, isError, DEFAULT_LOG_LEVEL_COLORS, stringify } from '../utils/index.js';
import { formatError } from './utils/error-formatter.js';
import { FormatterOption } from '../interfaces/index.js';

export class SimpleFormatter implements Formatter {
  option: FormatterOption = {
    color: true
  };

  constructor(option?: FormatterOption) {
    if (option !== undefined) {
      this.option = option;
    }
  }

  format({ level, args, options }: FormatterPayload): string {
    const { name, timestamp } = options || {};

    let prefix: string = '';
    prefix += timestamp ? `[${getTimeStamp(timestamp)}] ` : '';
    prefix += this.option.color ? `${colorize(DEFAULT_LOG_LEVEL_COLORS[level], level)}` : `${level}`;
    prefix += name ? ` [${name}]` : '';

    const message = this.parse(args);

    return `${prefix}${message.length ? ' ' : ''}${message}`;
  }

  parse(args: unknown[]) {
    return args.reduce((acc: string, arg: unknown) => {
      let argString = arg;

      if (typeof arg === 'object') {
        const argObject = arg as Object;

        if (isError(arg)) {
          argString = formatError(arg as Error);
        } else if (Object.keys(argObject).length > 0) {
          // not an empty object
          argString = stringify(argObject, 2);
        } else {
          return acc;
        }
      }
      return (acc += acc.length ? `\n${argString}` : `${argString}`);
    }, '');
  }
}
