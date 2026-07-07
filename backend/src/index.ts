import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middlewares/error';
import routes from './routes';
import { logger } from './utils/logger';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use('/api', routes);
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.url}` });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
