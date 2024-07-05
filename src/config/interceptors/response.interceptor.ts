import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';

// NOTE - This is the interface for the response
export class ResponseFormat<T> {
    @ApiProperty()
    method: string;

    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    // NOTE - This is the function that will be called before the response is sent
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseFormat<T>> {
        const now = Date.now();
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const statusCode = httpContext.getResponse().statusCode;
        const method = request.method;

        // TODO - Add more messages
        let message = '';
        switch (method) {
            case 'POST':
                message = 'Resource created';
                break;
            case 'GET':
                if (statusCode === HttpStatus.OK) {
                    message = 'Resource retrieved';
                } else if (statusCode === HttpStatus.NOT_FOUND) {
                    message = 'Resource not found';
                }
                break;
            case 'PATCH':
                message = 'Resource updated';
                break;
            case 'DELETE':
                message = 'Resource deleted';
                break;
            default:
                break;
        }

        // NOTE - This is the response that will be sent
        return next.handle().pipe(
            map((data) => ({
                message,
                data,
                duration: `${Date.now() - now}ms`,
                method: request.method,
                statusCode,
            })),
        );
    }
}
