import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import status from "http-status";
import { AppError } from "../Errors/AppError";
import { Prisma } from "../generated/prisma/client";

const ERROR_SENDER = "Global Error Handler";

type ErrorResponseOptions = {
    type?: string | null;
    errorCode?: string | null;
    details?: Record<string, unknown>;
};

const sendErrorResponse = (
    res: Response,
    statusCode: number,
    message: string,
    { type = null, errorCode = null, details = {} }: ErrorResponseOptions = {}
) => {
    return res.status(statusCode).json({
        ...details,
        status: statusCode,
        success: false,
        message,
        sender: ERROR_SENDER,
        errorCode,
        type,
    });
};

export const globalErrorHandler = (
    err: Error | Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError | Prisma.PrismaClientInitializationError | Prisma.PrismaClientUnknownRequestError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {

    console.error("🔥 FULL PRISMA ERROR:", err);

    // =====================================================
    // 🟡 1. PRISMA KNOWN REQUEST ERRORS (P2000 - P2029)
    // =====================================================
    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        const code = err.code;

        // 🔥 UNIQUE CONSTRAINT
        if (code === "P2002") {
            return sendErrorResponse(res, status.BAD_REQUEST, "Duplicate value (already exists)", {
                type: code,
                errorCode: code,
                details: { meta: err.meta },
            });
        }

        // 🔥 NOT FOUND
        if (code === "P2025" || code === "P2001") {
            return sendErrorResponse(res, status.NOT_FOUND, "Record not found", {
                type: code,
                errorCode: code,
                details: { meta: err.meta },
            });
        }

        // 🔥 FOREIGN KEY / RELATION ERRORS
        if (code === "P2003" || code === "P2014" || code === "P2017") {
            return sendErrorResponse(res, status.BAD_REQUEST, "Relation/foreign key constraint failed", {
                type: code,
                errorCode: code,
                details: { meta: err.meta },
            });
        }

        // 🔥 VALIDATION / INPUT ERRORS
        if (
            [
                "P2000",
                "P2005",
                "P2006",
                "P2007",
                "P2008",
                "P2009",
                "P2012",
                "P2013",
                "P2019",
                "P2020"
            ].includes(code)
        ) {
            return sendErrorResponse(res, status.BAD_REQUEST, "Invalid input data", {
                type: code,
                errorCode: code,
                details: { meta: err.meta },
            });
        }

        // 🔥 DATABASE ISSUES
        if (
            [
                "P2021",
                "P2022",
                "P2023",
                "P2024",
                "P2037"
            ].includes(code)
        ) {
            return sendErrorResponse(
                res,
                status.INTERNAL_SERVER_ERROR,
                "Database issue (table/column/connection problem)",
                {
                    type: code,
                    errorCode: code,
                    details: { meta: err.meta },
                }
            );
        }

        // 🔥 TRANSACTION / CONFLICT ERRORS
        if (
            [
                "P2034",
                "P2028",
                "P2027",
                "P2029"
            ].includes(code)
        ) {
            return sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, "Transaction/DB conflict error", {
                type: code,
                errorCode: code,
                details: { meta: err.meta },
            });
        }

        // 🔥 DEFAULT PRISMA KNOWN ERROR
        return sendErrorResponse(res, status.BAD_REQUEST, err.message, {
            type: code,
            errorCode: code,
            details: { meta: err.meta },
        });
    }

    // =====================================================
    // 🟠 2. PRISMA VALIDATION ERROR
    // =====================================================
    if (err instanceof Prisma.PrismaClientValidationError) {

        const message = err.message;

        // ============================
        // 1. FIELD EXTRACTION
        // ============================
        const fieldMatch =
            message.match(/Argument\s+`?(\w+)`?\s+is\s+missing/i) ||
            message.match(/Argument\s+`?(\w+)`?/i) ||
            message.match(/field\s+`?(\w+)`?/i);

        const field = fieldMatch?.[1] || "unknown_field";

        // ============================
        // 2. REASON EXTRACTION
        // ============================
        let reason = "unknown";

        if (/is missing/i.test(message)) {
            reason = "missing";
        } else if (/invalid/i.test(message)) {
            reason = "invalid";
        } else if (/expected/i.test(message)) {
            reason = "wrong_type";
        }
        const combinedMessage = `${field} is ${reason}`;
        return sendErrorResponse(res, status.BAD_REQUEST, message, {
            type: "PRISMA_VALIDATION_ERROR",
            errorCode: "PRISMA_VALIDATION_ERROR",
            details: {
                field,
                reason,
                combinedMessage,
            },
        });
    }

    // =====================================================
    // 🔴 3. PRISMA INIT ERROR (DB CONNECTION / ENV)
    // Covers P1000 - P1017 + P3000 - P3024 (schema engine)
    // =====================================================
    if (err instanceof Prisma.PrismaClientInitializationError) {
        return sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, err.message, {
            type: "PRISMA_INITIALIZATION_ERROR",
            errorCode: err.errorCode || "PRISMA_INIT_ERROR",
        });
    }

    // =====================================================
    // ⚪ 4. PRISMA UNKNOWN ENGINE ERROR
    // Covers P6000 - P6010 (Accelerate, engine crash, etc.)
    // =====================================================
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, err.message, {
            type: "PRISMA_UNKNOWN_ERROR",
        });
    }

    // ⚪ 5. Zod validation ERROR
    if (err instanceof ZodError) {
        const message = err.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");

        return sendErrorResponse(res, status.BAD_REQUEST, message, {
            type: "ZOD_VALIDATION_ERROR",
            errorCode: "ZOD_VALIDATION_ERROR",
            details: {
                issues: err.issues,
            },
        });
    }

    if (err instanceof AppError) {
        return sendErrorResponse(res, err.statusCode, err.message, {
            type: err.type,
            errorCode: err.type,
            details: {
                stack: err.stack,
            },
        });
    }

    // =====================================================
    // 🔥 5. NON-PRISMA ERROR (FALLBACK)
    // =====================================================
    return sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, err.message || "Something went wrong", {
        type: "INTERNAL_SERVER_ERROR",
    });
};


// helper (VERY IMPORTANT)
// function extractFromBackticks(text: string) {
//     const match = text.match(/`([^`]+)`/);
//     return match?.[1];
// }