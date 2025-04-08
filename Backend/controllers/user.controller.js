import { Mongoose } from "mongoose";
import User from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";


function formatDate(dateInput) {
    if (!dateInput) return "N/A"; // Handle null, undefined, or empty values

    let date;

    // Ensure it's a number before using it
    if (typeof dateInput === "string" && !isNaN(dateInput)) {
        date = new Date(Number(dateInput));
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date cases

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}



export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });

    if (!users.length) {
        return apiResponse.success(res, "No user found.", users, 200);
    }

    // Map over users and format date fields
    const usersData = users.map(user => ({
        ...user._doc,
        lastLogin: formatDate(user.lastLogin),
        createdAt: formatDate(user.createdAt)
    }));

    apiResponse.success(res, "Fetched successfully.", usersData, 200);
});

// 🔍 Search Users
export const searchUsers = asyncHandler(async (req, res) => {
    const { id, name, email, status } = req.query;
    let filter = {};

    if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new apiError(400, "Invalid User ID format." );
        }
        filter._id = id;
    }
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (status === 'verified') filter.isVerified = true;
    if (status === 'unverified') filter.isVerified = false;
    if (status === 'banned') filter.isBanned = true;

    const users = await User.find(filter);
    if(!users.length){apiResponse.success(res, "No User found.", users, 200)};

     // Map over users and format date fields
     const usersData = users.map(user => ({
        ...user._doc,
        lastLogin: formatDate(user.lastLogin),
        createdAt: formatDate(user.createdAt)
    }));
    apiResponse.success(res, "Fetched successfully.", usersData, 200);
})

// user Stats
// 📊 User Stats Route
export const userStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = totalUsers - verifiedUsers;
    const newUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    apiResponse.success(res, "Fetched Successfully!", { totalUsers, verifiedUsers, unverifiedUsers, newUsers, bannedUsers }, 200)
});

// ✅ Verify User
export const verifyUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, "User not found.");

    user.isVerified = true;
    await user.save();

    apiResponse.success(res, "User verified successfully", user, 200)
});

// 🚫 Ban/Suspend User
export const banUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, "User not found.");

    user.isBanned = !user.isBanned;
    await user.save();
    apiResponse.success(res, `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, user, 200);
});

// 🗑️ Delete User
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new apiError(404, "User not found.");

    await user.deleteOne();

    apiResponse.success(res, 'User deleted successfully', req.params.id);
});