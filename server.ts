import 'reflect-metadata'; 
import 'rootpath';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/error-handler';
import userController from './users/user.controller';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use('/users', userController);

// Global error handler (Ensures correct function signature)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

// Start server
const port: number = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
