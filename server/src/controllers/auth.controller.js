import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import sendToken, { cookieOptions } from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const clearAuthCookies = (res) => {
    const clearOpts = {
        ...cookieOptions(0),
        expires: new Date(0),
    };

    res.cookie("token", null, clearOpts);
    res.cookie("refreshToken", null, clearOpts);
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isVerified) {
            throw new ErrorHandler(
                "An account with this email already exists. Please log in.",
                409,
            );
        }

        existingUser.username = username;
        existingUser.password = password;
        existingUser.authProvider = "local";

        const plainCode = existingUser.getVerificationCode();

        await existingUser.save({ validateBeforeSave: false });

        const message = `
            Hello ${existingUser.username},

            Thank you for registering! Please verify your email using the code below:

            ${plainCode}

            This code expires in 10 minutes.

            If you did not request this, please ignore this email.

            Regards,
            The Cake Shop Team
        `;

        await sendEmail({
            email: existingUser.email,
            subject: "Email Verification Code - Cake Shop",
            message,
        });

        return res.status(200).json({
            success: true,
            message: `A new verification code has been sent to ${existingUser.email}. Please verify to complete registration.`,
        });
    }

    const user = await User.create({
        username,
        email,
        password,
        authProvider: "local",
    });

    const plainCode = user.getVerificationCode();

    await user.save({ validateBeforeSave: false });

    const message = `
        Hello ${user.username},

        Thank you for registering! Please verify your email using the code below:

        ${plainCode}

        This code expires in 10 minutes.

        If you did not request this, please ignore this email.

        Regards,
        The Cake Shop Team
    `;

    await sendEmail({
        email: user.email,
        subject: "Email Verification Code - Cake Shop",
        message,
    });

    res.status(201).json({
        success: true,
        message: `A verification code has been sent to ${user.email}.`,
        ...(process.env.NODE_ENV === "development" && {
            devCode: plainCode,
        }),
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        throw new ErrorHandler("Email and verification code are required", 400);
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
        email,
        verifyCode: hashedCode,
        verifyCodeExpiry: { $gt: Date.now() },
    }).select("+verifyCode +verifyCodeExpiry");

    if (!user) {
        throw new ErrorHandler(
            "Invalid or expired verification code. Please request a new one.",
            400,
        );
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    await sendToken(
        user,
        200,
        res,
        "Email verified successfully. You are now logged in.",
    );
});

export const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
        return res.status(200).json({
            success: true,
            message:
                "A new verification code has been sent to your email. Please check your inbox and spam folder.",
        });
    }

    const plainCode = user.getVerificationCode();

    await user.save({ validateBeforeSave: false });

    const message = `
        Hello ${user.username},

        Please verify your email using the code below:

        ${plainCode}

        This code expires in 10 minutes.

        If you did not request this, please ignore this email.
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "New Verification Code - Cake Shop",
            message,
        });
    } catch (error) {
    }

    res.status(200).json({
        success: true,
        message:
            "A new verification code has been sent to your email. Please check your inbox and spam folder.",
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ErrorHandler("Invalid email or password", 401);
    }

    
    if (user.authProvider === "google") {
        throw new ErrorHandler(
            "This account uses Google login. Please continue with Google.",
            401,
        );
    }

    if (!password || !(await user.comparePassword(password))) {
        throw new ErrorHandler("Invalid email or password", 401);
    }

    if (!user.isVerified) {
        throw new ErrorHandler(
            "Please verify your email before logging in. Use the verification code sent to your email.",
            403,
        );
    }

    await sendToken(user, 200, res, "Login successful");
});

export const googleLogin = asyncHandler(async (req, res) => {
    
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
        throw new ErrorHandler("Google credential is required", 400);
    }

    let profile;

    if (credential) {
        
        let ticket;

        try {
            ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (error) {
            throw new ErrorHandler(
                "Invalid or expired Google credential",
                401,
            );
        }

        profile = ticket.getPayload();
    } else {
        
        try {
            const response = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch Google user info");
            }

            profile = await response.json();
        } catch (error) {
            throw new ErrorHandler("Invalid or expired Google token", 401);
        }
    }

    if (!profile) {
        throw new ErrorHandler("Invalid Google account information", 401);
    }

    const {
        sub: googleId,
        email,
        email_verified: emailVerified,
        name,
        picture,
    } = profile;

    if (!email || !emailVerified || !googleId) {
        throw new ErrorHandler("Unable to verify your Google account", 401);
    }

    
    let user = await User.findOne({
        googleId,
    }).select("+refreshToken");

    if (user) {
        
        if (picture && user.avatarUrl !== picture) {
            user.avatarUrl = picture;
        }

        if (name && user.username !== name) {
            user.username = name;
        }

        user.isVerified = true;

        await user.save({ validateBeforeSave: false });

        return sendToken(user, 200, res, "Google login successful");
    }

    
    user = await User.findOne({ email }).select("+refreshToken");

    if (user) {
        
        if (user.authProvider === "local") {
            throw new ErrorHandler(
                "An account with this email already exists. Please log in with your email and password.",
                409,
            );
        }

        
        user.googleId = googleId;
        user.authProvider = "google";
        user.isVerified = true;

        if (name) {
            user.username = name;
        }

        if (picture) {
            user.avatarUrl = picture;
        }

        await user.save({ validateBeforeSave: false });

        return sendToken(user, 200, res, "Google login successful");
    }

    
    user = await User.create({
        username: name || email.split("@")[0],
        email,
        googleId,
        avatarUrl: picture || undefined,
        authProvider: "google",
        isVerified: true,
    });

    await sendToken(user, 201, res, "Google account created successfully");
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ErrorHandler(
            "No refresh token provided, please login again",
            401,
        );
    }

    let decoded;

    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
    } catch {
        throw new ErrorHandler(
            "Refresh token is invalid or has expired, please login again",
            401,
        );
    }

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ErrorHandler(
            "Refresh token is invalid or has expired, please login again",
            401,
        );
    }

    await sendToken(user, 200, res, "Access token refreshed");
});

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, password reset instructions have been sent.",
        });
    }

    
    if (user.authProvider === "google") {
        return res.status(200).json({
            success: true,
            message:
                "This account uses Google login. Please continue with Google to sign in.",
        });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CLIENT_URL}/password/reset/${resetToken}`;

    const message = `
        Hello ${user.username},

        We received a request to reset your password. Click the link below:

        ${resetPasswordUrl}

        This link expires in 15 minutes. If you did not request this, please ignore this email.

        The Cake Shop Team
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request - Action Required",
            message,
        });

        res.status(200).json({
            success: true,
            message: `An email with password reset instructions has been sent to ${user.email}.`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw new ErrorHandler(
            "Failed to send password reset email. Please try again later.",
            500,
        );
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
        throw new ErrorHandler(
            "Reset password token is invalid or has expired",
            400,
        );
    }

    
    if (user.authProvider === "google") {
        throw new ErrorHandler(
            "This account uses Google login and does not have a local password.",
            400,
        );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await sendToken(
        user,
        200,
        res,
        "Password reset successful. You are now logged in.",
    );
});
