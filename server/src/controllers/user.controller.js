import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import sendToken from "../utils/sendToken.js";

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User found",
        data: req.user,
    });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatched = await user.comparePassword(
        req.body.currentPassword,
    );

    if (!isPasswordMatched) {
        throw new ErrorHandler("Current password is incorrect", 401);
    }

    user.password = req.body.newPassword;

    await user.save();

    await sendToken(user, 200, res, "Password updated successfully");
});


export const getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await User.aggregate([
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "user",
                as: "orders",
            },
        },

        {
            $addFields: {
                totalOrders: { $size: "$orders" },
                totalSpent: { $sum: "$orders.totalPrice" },
                paidAmount: {
                    $sum: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$orders",
                                    as: "order",
                                    cond: {
                                        $eq: ["$$order.paymentStatus", "paid"],
                                    },
                                },
                            },
                            as: "order",
                            in: "$$order.totalPrice",
                        },
                    },
                },
                lastOrderAt: { $max: "$orders.createdAt" },
                deliveredOrders: {
                    $size: {
                        $filter: {
                            input: "$orders",
                            as: "order",
                            cond: {
                                $eq: ["$$order.orderStatus", "delivered"],
                            },
                        },
                    },
                },
                cancelledOrders: {
                    $size: {
                        $filter: {
                            input: "$orders",
                            as: "order",
                            cond: {
                                $eq: ["$$order.orderStatus", "cancelled"],
                            },
                        },
                    },
                },
                isStaff: { $ne: ["$role", "user"] },
            },
        },
        {
            $project: {
                orders: 0,
                password: 0,
                refreshToken: 0,
                googleId: 0,
                verifyCode: 0,
                resetPasswordToken: 0,
            },
        },
        { $sort: { totalOrders: -1, createdAt: -1 } },
    ]);

    res.status(200).json({
        success: true,
        message: "Customers fetched successfully",
        data: customers,
    });
});


