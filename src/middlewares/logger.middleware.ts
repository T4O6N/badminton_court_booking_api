import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLoggerService } from 'src/config/loggers/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: WinstonLoggerService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      // const response = res.statusMessage;
      const statusCode = res.statusCode;
      const data = req.body;
      const userAgent = req.headers['user-agent'];
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      if (isNumberBetween(statusCode, 200, 299)) {
        this.logger.log(
          `\n---------------------------------------------\n 👉 [INCOMING REQUEST] : [STATUS CODE: ${statusCode}] | [METHOD: ${
            req.method
          }] | [PATH: ${req.originalUrl}] | [IP: ${ip}] | [BODY: ${JSON.stringify(data)}] | [QUERY: ${JSON.stringify(
            req.query,
          )}] | [USER AGENT: ${userAgent}]🐶 \n---------------------------------------------\n`,
        );
      }

      if (isNumberBetween(statusCode, 400, 500)) {
        this.logger.warn(
          `\n---------------------------------------------\n ⚠️ [BAD REQUEST] : [STATUS CODE: ${statusCode}] | [METHOD: ${
            req.method
          }] | [PATH: ${req.originalUrl}] | [IP: ${ip}] | [BODY: ${JSON.stringify(data)}] | [QUERY: ${JSON.stringify(
            req.query,
          )}] | [USER AGENT: ${userAgent}]🐶 \n---------------------------------------------\n`,
        );
      }

      if (isNumberBetween(statusCode, 500, 599)) {
        this.logger.error(
          `\n---------------------------------------------\n 🚫 [SERVER ERROR REQUEST] : [STATUS CODE: ${statusCode}] | [METHOD: ${
            req.method
          }] | [PATH: ${req.originalUrl}] | [IP: ${ip}] | [BODY: ${JSON.stringify(data)}] | [QUERY: ${JSON.stringify(
            req.query,
          )}] | [USER AGENT: ${userAgent}]🐶 \n---------------------------------------------\n`,
        );
      }
    });

    next();
  }
}

function isNumberBetween(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
