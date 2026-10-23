import { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import { jwtUtils } from "./jwt";
import { cookiesUtils } from "./cookie";
import { env } from "../config/env";


const createAccessToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(
        payload,
        // process.env.ACCESS_TOKEN_SECRET as string,
        env.accessTokenSecret,
        {
            expiresIn: "1d",
        }
    );

    return token;
};


const createRefreshToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(
        payload,
        env.refreshTokenSecret,
        {
            // expiresIn: Number(env.refreshTokenExpiration)
            expiresIn: "7d",
        }
    );

    return token;
};



// ----------------------- set tokens on cookie -----------------------
const setAccessTokenCookie = (res: Response, key: string, value: string) => {
    cookiesUtils.setCookie(res, key, value,
        {
            httpOnly: true,  // JS can't read
            secure: env.NODE_ENV === "production",  // true in HTTPS production
            sameSite: env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 1000, // 1day
            path: "/",       // all routes
        }
    );
}

const setRefreshTokenCookie = (res: Response, key: string, value: string) => {
    cookiesUtils.setCookie(res, key, value,
        {
            httpOnly: true,  // JS can't read
            secure: env.NODE_ENV === "production",  // true in HTTPS production
            sameSite: env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 1000 * 7, // 7day
            path: "/",       // all routes
        }
    );
}

const setBetterAuthTokenCookie = (res: Response, key: string, value: string) => {
    cookiesUtils.setCookie(res, key, value,
        {
            httpOnly: true,  // JS can't read
            secure: env.NODE_ENV === "production",
            sameSite: env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 1000, // 7day
            path: "/",       // all routes
        }
    );
}


export const tokenUtils = {
    createAccessToken,
    createRefreshToken,
    
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthTokenCookie
};