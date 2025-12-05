import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../routes';
import * as Utils from './utils';

// Import Utility
import logger, { morganMiddleware } from './logger';
import { MulterError } from 'multer';
// import { sendScheduleRideNotification, sendWeeklyStatement } from './scheduleRideCron.utils';

export function createServer() {
  return new Promise<Express>((resolve, reject) => {
    try {
      const app: Express = express();

      // enable CORS - Cross Origin Resource Sharing
      app.use(cors({ credentials: true, origin: '*' }));
      app.use(morganMiddleware);

      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());

      app.use('/api/v1', routes);

      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof MulterError) {
          res
            .status(Utils.statusCode.BAD_REQUEST)
            .json({ status: 'error', error: 'File upload failed', message: err.message });
        } else {
          next(err);
        }
      });

      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof SyntaxError && (err as any).status === 413 && 'body' in err) {
          res
            .status(Utils.statusCode.REQUEST_ENTITY_LARGE)
            .send({ status: 'error', message: 'Request entity too large' });
        } else {
          next(err);
        }
      });

      app.get('/', (req: Request, res: Response) => {
        res.send({ message: 'Welcome to ecommerce' });
      });
      resolve(app);
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });
}
