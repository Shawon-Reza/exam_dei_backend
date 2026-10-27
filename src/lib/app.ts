import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';
import { indexRoute } from '../modules/routes/indexRoute';
import { globalErrorHandler } from '../middlewares/globalErrorHandler';
import { notFoundMiddleware } from '../middlewares/notFoundMiddleware';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import cookieParser from 'cookie-parser';
import path from 'node:path';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src/email_templates'));

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.all('/api/auth/{*any}', toNodeHandler(auth));


// ---------------- Server Health Check ---------------- 


app.get("/", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            success: true,
            status: "Chakriova API is healthy",
            services: {
                api: "up",
                database: "up",
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: "unhealthy",
            services: {
                api: "up",
                database: "down",
            },
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
        });
    }
});


app.use('/api/v1', indexRoute);

// ---------------- Middleware for Error Handling ----------------
app.use(globalErrorHandler);
app.use(notFoundMiddleware);
