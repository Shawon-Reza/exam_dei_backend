import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { env } from "../config/env";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    baseURL: env.BETTER_AUTH_URL,

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignup: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },


    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
    },


    plugins: [
        bearer(),
        emailOTP({
            otpLength: 4,
            expiresIn: 300, // 300 seconds
            allowedAttempts: 1,
            overrideDefaultEmailVerification: true,


            async sendVerificationOTP({ email, otp, type }) {
                console.log(`Sending OTP to ${email}: ${otp} for ${type}`);
                // ------------------ get user by email ------------------
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (type === "sign-in") {
                    // Send the OTP for sign in


                } else if (type === "email-verification") {
                    // Send the OTP for email verification
                    try {


                        if (user && !user.emailVerified) {
                            await sendEmail(
                                {
                                    to: email,
                                    subject: "Email Verification OTP",
                                    template: "email_verification",
                                    templateName: "/otp",
                                    templateData: {
                                        otp,
                                        userName: user?.name,
                                    }
                                }
                            );
                        }

                    } catch (error) {
                        console.error("Error sending email verification OTP:", error);
                    }


                } else if (type === "forget-password") {
                    // Send the OTP for password reset
                    try {
                        await sendEmail(
                            {
                                to: email,
                                subject: "Password Reset OTP",
                                template: "password_reset",
                                templateName: "/password_reset",
                                templateData: {
                                    otp,
                                    userName: user?.name,
                                }
                            }
                        );
                    } catch (error) {
                        console.error("Error sending forget password OTP:", error);
                        throw new Error("Failed to send forget password OTP", { cause: error });
                    }
                }
            },
        })
    ],

    // #Additional fields for user model
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: true,
                required: false,
            },

            userStatus: {
                type: "string",
                input: true,
                required: false,
            },

            needPasswordChange: {
                type: "boolean",
                input: false,
                required: false,
            },

            deletedAt: {
                type: "date",
                input: false,
                required: false,
            },
        },
    },


    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5000",
    ],
});