import * as path from 'path';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const logDir: string = path.join(__dirname, '../../../', 'logs');

const winstonPrintFormat = winston.format.printf(
  (info) =>
    `[${info.timestamp}] | [${info.level}]: ${info.message} [${
      info?.context ?? '-'
    }] [CLASS: ${info?.className ?? '-'}] [FUNCTION: ${
      info?.functionName ?? '-'
    }()]`,
);

const removeASCIICode = winston.format((info) => {
  info.message = info.message.replace(/\x1B\[([0-9;]*)([A-Za-z])/g, '');
  info.level = info.level.replace(/\x1B\[([0-9;]*)([A-Za-z])/g, '');

  return info;
});

export const winstonFormatOptions = winston.format.combine(
  removeASCIICode(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.simple(),
  winstonPrintFormat,
);

const winstonConsoleFormat = winston.format.combine(
  removeASCIICode(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.colorize({
    all: true,
    colors: {
      info: 'gray bold bgBlue',
      warn: 'yellow bold underline',
      error: 'red bold bgWhite',
      debug: 'green bold italic',
    },
  }),
  winston.format.simple(),
  winstonPrintFormat,
);

export const wintonTransportOptions = [
  new winstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/generated-qr',
    filename: `%DATE%.log`,
    maxFiles: 30, // 30 Days saved
    json: true,
    zippedArchive: true,
  }),
  new winstonDaily({
    level: 'warn',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/paid-log',
    filename: `%DATE%.log`,
    maxFiles: 30, // 30 Days saved
    json: true,
    zippedArchive: true,
  }),
  new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/error',
    filename: `%DATE%.log`,
    maxFiles: 30, // 30 Days saved
    handleExceptions: true,
    json: true,
    zippedArchive: true,
  }),
  new winston.transports.Console({ format: winstonConsoleFormat }),
];
