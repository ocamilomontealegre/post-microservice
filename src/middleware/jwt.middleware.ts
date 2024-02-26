import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;
    const isGetRequest = req.method === 'GET';

    if (!isGetRequest && authorization) {
      if (!authorization.startsWith('Bearer ')) {
        console.log('Bearer part is missing. Adding it...');
      }

      try {
        console.log('I AM HERE');
        const token = authorization.slice(7);
        const decoded = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
        );
        req['userId'] = decoded.sub;
      } catch (error) {
        // Handle any errors that might occur during parsing or decoding
        console.error('Error occurred while processing the token:', error);
      }
    }

    next();
  }
}
