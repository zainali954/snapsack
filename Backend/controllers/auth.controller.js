import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import apiError from '../utils/apiError.js';
import { loginValidation, registerValidation } from '../validation/authValidation.js';
import generateJWT from '../utils/generateJWTs.js';
import { sendResetPassword, sendResetPasswordSuccessful, sendVerifiedSuccessfully, sendVerifyEmail } from '../utils/sendEmails.js';
import axios from 'axios';

// Generate Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Register User
export const register = asyncHandler(async (req, res) => {
    // ✅ Joi validation
    const { error } = registerValidation.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map(err => err.message).join(", ");
        throw new apiError(400, errorMessage)
    }
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new apiError(400, "User already exists.");
    }

    // generate 6 digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // hash this verification code
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    const user = await User.create({
        name,
        email,
        password,
        verificationCode: hashedVerificationCode,
        verificationCodeExpiry: Date.now() + 15 * 60 * 1000 // 15 minutes
    })

    if (user) {
        await sendVerifyEmail(user.email, verificationCode)
        const filteredUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            isBanned: user.isBanned,
            addresses: user.addresses,
            lastLogin: user.lastLogin,
          };
          
        apiResponse.success(res, "User registered successfully", filteredUser, 201);
    } else {
        throw new apiError(400, "Invalid user data.");
    }
});

// Login User
export const login = asyncHandler(async (req, res) => {
    // ✅ Joi validation
    const { error } = loginValidation.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map(err => err.message).join(", ");
        throw new apiError(400, errorMessage)
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {

        const { accessToken, refreshToken } = await generateJWT(user)

        // Send new tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        user.lastLogin = Date.now();
        await user.save()

        const filteredUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            isBanned: user.isBanned,
            addresses: user.addresses,
            lastLogin: user.lastLogin,
          };
          
        apiResponse.success(res, "Login successful", filteredUser, 200);
    } else {
        throw new apiError(401, "Invalid credentials.");
    }
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        throw new apiError(400, "Authorization code is required.")
    }
    try {
        // Exchange authorization code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "postmessage",  // Use postmessage for SPAs
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenResponse.data;  // Get only access token

        // Fetch user data from Google
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,  // Use the access token to fetch user data
            },
        });

        const userData = userInfoResponse.data;

        // Check if user already exists in DB
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            user = new User({
                email: userData.email,
                googleId: userData.id,
                name: userData.name,
                isVerified: true, // Google users are automatically verified
                lastLogin: new Date(), // Set the last login timestamp
            });
            await user.save();  // Save new user to the database
        } else {
            user.lastLogin = new Date();
            await user.save(); // Save changes
        }

        const { accessToken, refreshToken } = await generateJWT(user)

        // Send new tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const filteredUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            isBanned: user.isBanned,
            addresses: user.addresses,
            lastLogin: user.lastLogin,
        };

        // send response
        apiResponse.success(res, "User logged in successfully", filteredUser, 200)

    } catch (error) {
        console.error("Error during Google login:", error.response || error.message || error);
        throw new apiError(500, "Failed to log in with Google");
    }
})


export const logout = asyncHandler(async (req, res) => {
    // Refresh token from cookies
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        return apiResponse.success(res, "User logged out successfully", {}, 200); // Soft response
    }

    // Decode refresh token
    let decoded;
    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return apiResponse.success(res, "User logged out successfully", {}, 200); // Expired token case
    }

    // Find user by refresh token
    const user = await User.findById(decoded._id);
    if (user) {
        user.refreshToken = null; // Remove refresh token
        await user.save();
    }

    // Expire cookies
    res.cookie("accessToken", "", { httpOnly: true, expires: new Date(0) });
    res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });

    apiResponse.success(res, "User logged out successfully", {}, 200);
});

// Get User Profile
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
        throw new apiError(404, "User not found.");
    }

    apiResponse.success(res, "User profile fetched successfully", user, 200);
});

// Refresh Token
export const refreshToken = asyncHandler(async (req, res,) => {
    const IncommingRefreshToken = req.cookies?.refreshToken

    if (!IncommingRefreshToken) {
        throw new apiError(401, "Session expired. Please login again.");
    }

    let decoded;
    try {
        decoded = jwt.verify(IncommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new apiError(403, "Invalid or expired refresh token. Please login again.");
    }

    const user = await User.findById(decoded._id);
    if (!user) {
        throw new apiError(404, "User not found. Please log in again.");
    }

    if (user.refreshToken !== IncommingRefreshToken) {
        user.refreshToken = null; // Revoke refresh token
        await user.save();
        throw new apiError(401, "Invalid session. Please login again.");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await generateJWT(user);

    user.refreshToken = refreshToken;
    await user.save()

    // Set cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    apiResponse.success(res, "Token refreshed successfully.", { accessToken }, 200)
});

// add address
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) throw new apiError(404, "User not found.");

    user.addresses.push(req.body);
    await user.save();
    const filteredUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
        addresses: user.addresses,
        lastLogin: user.lastLogin,
      };
    apiResponse.success(res, "Added Successfully.", filteredUser, 200)
})

// remove address
export const removeAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new apiError(404, "User not found.");

    const { index } = req.params; // Get index from URL params

    if (index < 0 || index >= user.addresses.length) {
        throw new apiError(400, "Invalid address index.");
    }

    user.addresses.splice(index, 1); // Remove the address at the given index
    await user.save();

    apiResponse.success(res, "Address removed successfully.", user, 200);
});

// verifyEmail 
export const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id
    // Find user by ID (if logged in) or by email (if not logged in)
    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404, "User not found check your email");
    }

    // Check if the verification code exists and has not expired
    if (!user.verificationCode) {
        throw new apiError(400, "Verification code not found or already used");
    }

    if (user.verificationCodeExpiry && user.verificationCodeExpiry < Date.now()) {
        throw new apiError(400, "Verification code has expired");
    }

    // Validate the verification code
    const isCodeValid = await bcrypt.compare(code, user.verificationCode);
    if (!isCodeValid) {
        throw new apiError(400, "Invalid verification code");
    }

    // Check if the email is already verified
    if (user.isVerified) {
        throw new apiError(400, "Email already verified");
    }

    // Mark user as verified and clear verification code/expiry
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    // Notify the user and send a success response
    try {
        sendVerifiedSuccessfully(user.email);
    } catch (error) {
        console.error("Failed to send verification email:", error.message);
    }

    const filteredUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
        addresses: user.addresses,
        lastLogin: user.lastLogin,
      };

    apiResponse.success(res, "Email verified successfully", filteredUser, 200);
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new apiError(404, "User not found")
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    user.verificationCode = hashedVerificationCode
    user.verificationCodeExpiry = Date.now() + 15 * 60 * 1000 //15 minutes
    await user.save()

    await sendVerifyEmail(user.email, verificationCode)

    apiResponse.success(res, "If the email exists, a code has been sent", {}, 200)
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) throw new apiError(400, "Email is required.")
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(404, "No account found with this email address.");
    }

    // Generate reset token
    const passwordResetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

    // Send reset link via email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${passwordResetToken}`;
    sendResetPassword(user.email, resetLink);

    // Respond with success message
    apiResponse.success(
        res,
        "A password reset email has been sent. Please check your inbox.",
        {},
        200
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    if (!password) {
        throw new apiError(400, "Password is required.")
    }

    // Ensure token is provided
    if (!token) {
        throw new apiError(400, "Reset token is missing. Please try again.");
    }

    // decode the token and takeout user email
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        console.error(error)
    }

    const user = await User.findOne({
        email: decoded.email
    });

    if (!user) {
        throw new apiError(400, "Invalid or expired token. Please request a new one.");
    }

    user.password = password;
    await user.save();

    // Notify user of successful password change
    sendResetPasswordSuccessful(user.email);

    // Respond with success message
    apiResponse.success(
        res,
        "Your password has been reset successfully. You can now log in with your new password.",
        {},
        200
    );
});