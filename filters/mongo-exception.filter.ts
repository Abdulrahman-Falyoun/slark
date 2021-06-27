import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {MongoError} from 'mongodb';
import {Request, Response} from "express";

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        switch (exception.code) {
            case 11000:
                // duplicate exception
                return response.status(HttpStatus.BAD_REQUEST).json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    error: exception,
                    message: exception.errmsg
                })
            default:
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    error: exception
                });
        }
    }
}