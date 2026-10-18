import { Request, Response } from "express"
import { catchAsyncError } from "../Errors/catchAsyncError"
import status from "http-status"
import { authServices } from "./auth.services";
import { tokenUtils } from "../utils/tokens";
import { cookiesUtils } from "../utils/cookie";
import { env } from "../../config/env";
import { auth } from "../../lib/auth";

const getFrontendRedirectPath = (value: unknown) => {
    if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
        return "/";
    }

    const frontendUrl = new URL(env.FRONTEND_URL);
    const targetUrl = new URL(value, frontendUrl);
    return targetUrl.origin === frontendUrl.origin
        ? `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`
        : "/";
};

const getFrontendUrl = (path: string) => new URL(path, env.FRONTEND_URL).toString();


const emailLogin = catchAsyncError(
    async (req: Request, res: Response) => {

        const result = await authServices.emailLogin(req.body);


        //  ---------------- set cookies ----------------
        tokenUtils.setAccessTokenCookie(res, "accessToken", result.accessToken);
        tokenUtils.setRefreshTokenCookie(res, "refreshToken", result.refreshToken);
        tokenUtils.setBetterAuthTokenCookie(res, "better-auth.session_token", result.token);


        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Email login successful",
            data: result
        })
    }
)

const emailRegister = catchAsyncError(
    async (req: Request, res: Response) => {

        const result = await authServices.emailRegister(req.body);
        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Email registration successful",
            data: result
        })
    }
)


const logout = catchAsyncError(
    async (req: Request, res: Response) => {
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        const result = await authServices.logout(betterAuthSessionToken);

        cookiesUtils.clearCookie(res, "accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        cookiesUtils.clearCookie(res, "refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        cookiesUtils.clearCookie(res, "better-auth.session_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });


        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Logout successful",
            data: result
        })
    }
)

const emailOTPVerification = catchAsyncError(
    async (req: Request, res: Response) => {
        const result = await authServices.emailOTPVerification(req.body);

        //  ---------------- set cookies ----------------
        tokenUtils.setAccessTokenCookie(res, "accessToken", result.accessToken);
        tokenUtils.setRefreshTokenCookie(res, "refreshToken", result.refreshToken);
        tokenUtils.setBetterAuthTokenCookie(res, "better-auth.session_token", result.token as string);

        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Email OTP verification successful",
            data: result
        })
    }
)

const googleLogin = catchAsyncError(
    async (req: Request, res: Response) => {
        const redirectPath = getFrontendRedirectPath(req.query.redirectUrl);
        const callbackURL = new URL("/api/v1/auth/google-login/success", env.BETTER_AUTH_URL);
        callbackURL.searchParams.set("redirect", redirectPath);

        res.render("googleRedirect", {
            callbackURL: callbackURL.toString(),
            betterAuthUrl: env.BETTER_AUTH_URL,
        })
    }
)

const googleLoginPost = catchAsyncError(
    async (req: Request, res: Response) => {
        const loginUrl = new URL("/api/v1/auth/google-login", env.BETTER_AUTH_URL);
        loginUrl.searchParams.set("redirectUrl", getFrontendRedirectPath(req.query.redirectUrl));
        return res.redirect(303, loginUrl.toString());
    }
)

const googleLoginSuccess = catchAsyncError(
    async (req: Request, res: Response) => {
        const redirectPath = getFrontendRedirectPath(req.query.redirect);
        const session = await auth.api.getSession({
            headers: new Headers({ cookie: req.headers.cookie ?? "" }),
        });

        if (!session || !session.user) {
            const loginUrl = new URL("/login", env.FRONTEND_URL);
            loginUrl.searchParams.set("error", "oauth_failed");
            return res.redirect(loginUrl.toString());
        }

        const result = authServices.googleSignInSuccess(session.user);

        tokenUtils.setAccessTokenCookie(res, "accessToken", result.accessToken);
        tokenUtils.setRefreshTokenCookie(res, "refreshToken", result.refreshToken);

        return res.redirect(getFrontendUrl(redirectPath));
    }
)

const resetPasswordRequest = catchAsyncError(
    async (req: Request, res: Response) => {
        const result = await authServices.resetPasswordRequest(req.body);

        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Password reset request successful",
            data: result
        })
    }
);

const checkVerificationOTP = catchAsyncError(
    async (req: Request, res: Response) => {
        const result = await authServices.checkVerificationOTP(req.body);

        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Verification OTP check successful",
            data: result
        }
        );
    }
);

const resetPassword = catchAsyncError(
    async (req: Request, res: Response) => {
        const result = await authServices.resetPassword(req.body);

        res.status(200).json({
            status_code: status.OK,
            success: true,
            message: "Password reset successful",
            data: result
        }
        );
    });


export const authControllers = {
    emailLogin,
    emailRegister,
    googleLogin,
    googleLoginPost,
    googleLoginSuccess,
    logout,
    emailOTPVerification,
    resetPasswordRequest,
    checkVerificationOTP,
    resetPassword
}
