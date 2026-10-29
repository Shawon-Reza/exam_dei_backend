import { auth } from "../../lib/auth";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
 
 
 
 
 
import { tokenUtils } from "../../utils/tokens";
 

type AuthUser = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["user"];

const emailLogin = async (payload: Record<string, unknown>) => {


    const { email, password, callbackURL, rememberMe } = payload;

    const userExistance = await prisma.user.findUnique({
        where: {
            email: email as string
        }
    })

    if (!userExistance) {
        throw new Error("No account found with this email")
    }

    const result = await auth.api.signInEmail({
        body: {
            email: email as string,
            password: password as string,
            rememberMe: rememberMe as boolean || true,
            callbackURL: callbackURL as string || env.FRONTEND_URL,
        },
    });

    console.log(result)

    // --------------------- Access Token and Refresh Token Generation ---------------------
    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        image: result.user.image,
        needPasswordChange: result.user.needPasswordChange,

    });
    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        image: result.user.image,
        needPasswordChange: result.user.needPasswordChange,
    });

    return { ...result, accessToken, refreshToken };

}
const emailRegister = async (payload: Record<string, unknown>) => {
    const { name, email, password, image } = payload;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email as string,
        },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const data = await auth.api.signUpEmail({
        body: {
            name: name as string,
            email: email as string,
            password: password as string,
            image: image as string,
        },
    });

    return data;
}
const logout = async (betterAuthSessionToken: string) => {
    const data = await auth.api.signOut({
        // Pass the current request headers so Better Auth can read and set cookies.
        // headers: await headers(),
        headers: new Headers(
            {
                Authorization: `Bearer ${betterAuthSessionToken}`
            }
        ),
    });

    return data;
}

const emailOTPVerification = async (payload: Record<string, unknown>) => {
    const { email, otp } = payload;
    const result = await auth.api.verifyEmailOTP({
        body: {
            email: email as string, // required, Email address to verify.
            otp: otp as string, // required, OTP to verify.
        },
    });

    // --------------------- Access Token and Refresh Token Generation ---------------------
    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        image: result.user.image,
        needPasswordChange: result.user.needPasswordChange,

    });
    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        image: result.user.image,
        needPasswordChange: result.user.needPasswordChange,
    });

    return { ...result, accessToken, refreshToken };
}


const googleSignInSuccess = (user: AuthUser) => {
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        needPasswordChange: user.needPasswordChange,
    };

    return {
        accessToken: tokenUtils.createAccessToken(tokenPayload),
        refreshToken: tokenUtils.createRefreshToken(tokenPayload),
    };
}

const resetPasswordRequest = async (payload: Record<string, unknown>) => {
    const { email } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email: email as string,
        },
    });
    if (!user) {
        throw new Error("No account found with this email address");
    }

    const data = await auth.api.requestPasswordResetEmailOTP({
        body: {
            email: email as string, // required, Email address to send the OTP.
        },
    });
    return data;
}

const checkVerificationOTP = async (payload: Record<string, unknown>) => {
    const { email, otp, type } = payload;

    const data = await auth.api.checkVerificationOTP({
        body: {
            email: email as string, // required, Email address to send the OTP.
            type: type as "sign-in" | "email-verification" | "forget-password" | "change-email", // required, Type of the OTP.
            otp: otp as string, // required, OTP sent to the email.
        },
    });

    return data;
}
const resetPassword = async (payload: Record<string, unknown>) => {
    const { email, otp, password } = payload;
    const data = await auth.api.resetPasswordEmailOTP({
        body: {
            email: email as string, // required, Email address to reset the password.
            otp: otp as string, // required, OTP sent to the email.
            password: password as string, // required, New password.
        },
    });

    return data;
}

const sendVerificationOTP = async (payload :Record<string, unknown>) => {
    const { email } = payload
    const data = await auth.api.sendVerificationOTP({
        body: {
            email: email as string, // required, Email address to send the OTP.
            type: "email-verification", // required, Type of the OTP.
        },
    });
    return data
}

const me = async (payload: { email: string }) => {
    const { email } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    console.log(user)

    return user;
};

export const authServices = {
    emailLogin,
    emailRegister,
    googleSignInSuccess,
    logout,
    emailOTPVerification,
    resetPasswordRequest,
    checkVerificationOTP,
    resetPassword,
    sendVerificationOTP,
    me
}