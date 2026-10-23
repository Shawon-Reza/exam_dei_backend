import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    FRONTEND_URL: z.url().default("http://localhost:3000"),

    PORT: z.coerce.number().default(5000),
    DATABASE_URL:
        z.url()
            .max(2048, "DATABASE_URL must be a valid URL")
            .min(1, "DATABASE_URL is required"),

    BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
    BETTER_AUTH_URL: z.url().min(1, "BETTER_AUTH_URL is required"),
    SMTP_USER: z.string().min(1, "SMTP_USER is required"),
    SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
    SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
    SMTP_PORT: z.coerce.number().min(1, "SMTP_PORT is required"),

    accessTokenSecret: z.string().min(1, "accessTokenSecret is required"),
    refreshTokenSecret: z.string().min(1, "refreshTokenSecret is required"),
    accessTokenExpiration: z.string().min(1, "accessTokenExpiration is required"),
    refreshTokenExpiration: z.string().min(1, "refreshTokenExpiration is required"),

    GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
    GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

    CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
    CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});


const parsedEnv = envSchema.safeParse(process.env);


if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:");

    console.error(parsedEnv.error.flatten().fieldErrors);

    process.exit(1);
}

export const env = parsedEnv.data;