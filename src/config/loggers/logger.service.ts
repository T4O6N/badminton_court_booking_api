import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { wintonTransportOptions, winstonFormatOptions } from './logger.option';
@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winstonFormatOptions,
      transports: wintonTransportOptions,
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('events').EventEmitter.defaultMaxListeners = 200;
  }

  log(message: string, context?: object) {
    const className = new Error().stack
      .split('\n')[2]
      .split(' ')[5]
      .split('.')[0];
    const functionName = new Error().stack.split('\n')[2].split(' ')[5];

    this.logger.log('info', message, { context, className, functionName });
  }

  error(message: string, context?: object) {
    const className = new Error().stack
      .split('\n')[2]
      .split(' ')[5]
      .split('.')[0];
    const functionName = new Error().stack.split('\n')[2].split(' ')[5];
    this.logger.error(message, { context, className, functionName });
  }

  warn(message: string, context?: object) {
    const className = new Error().stack
      .split('\n')[2]
      .split(' ')[5]
      .split('.')[0];
    const functionName = new Error().stack.split('\n')[2].split(' ')[5];
    this.logger.warn(message, { context, className, functionName });
  }
}
