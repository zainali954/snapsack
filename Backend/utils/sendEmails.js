import { verify_email, email_verified, reset_password, reset_password_successful } from "../templates/email.templates.js";
import dotenv from 'dotenv'
dotenv.config()
import { Resend } from 'resend';
const resend_api_key =process.env.RESEND_API_KEY

const resend = new Resend(resend_api_key); // Replace with your actual API key


export const sendVerifyEmail = async (email, code) => {
    try {
        if (!email || !code) {
            throw new Error("Email and verification code are required");
        }
        const emailContent = verify_email.replace("{{CODE}}", code);

        const response = await resend.emails.send({
            from: 'Snapsack@resend.dev', // Use a verified sender domain
            to : email,
            subject: 'Verify your email',
            html: emailContent,
        });

    } catch (error) {
        console.error(`Error sending verification email to ${email}: ${error.message}`, { error });
        throw error; // Re-throw error to let the caller handle it
    }
};

export const sendVerifiedSuccessfully = async (email) => {
    try {
        if (!email) {
            throw new Error("Email is required");
        }

        const emailContent = email_verified;
        const response = await resend.emails.send({
            from: 'Snapsack@resend.dev', // Use a verified sender domain
            to : email,
            subject: 'Email Verified Successfully.',
            html: emailContent,
        });

    } catch (error) {
        console.error(`Error sending verified successfully email to ${email}: ${error.message}`, { error });
        throw error;
    }
};

export const sendResetPassword = async (email, resetLink) => {
    try {
        if (!email || !resetLink) {
            throw new Error("Email and reset link are required");
        }
        const emailContent = reset_password.replaceAll("{{RESET_LINK}}", resetLink);
    const response = await resend.emails.send({
        from: 'Snapsack@resend.dev', // Use a verified sender domain
        to : email,
        subject: 'Reset your password.',
        html: emailContent,
    });

    } catch (error) {
        console.error(`Error sending reset password email to ${email}: ${error.message}`, { error });
        throw error;
    }
};

export const sendResetPasswordSuccessful = async (email) => {
    try {
        if (!email) {
            throw new Error("Email is required");
        }

        const emailContent = reset_password_successful;
        const response = await resend.emails.send({
            from: 'Snapsack@resend.dev', // Use a verified sender domain
            to : email,
            subject: 'Password reset Successfully.',
            html: emailContent,
        });

    } catch (error) {
        console.error(`Error sending reset password successful email to ${email}: ${error.message}`, { error });
        throw error;
    }
};