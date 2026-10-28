import { Resend } from "resend";
import logger from "./logger.js";

let resendClient;

const getClient = () => {
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
};

const sendEmail = async (options) => {
    try {
        const { error } = await getClient().emails.send({
            from: process.env.EMAIL_FROM,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        });

        if (error) {
            // Don't throw here - return error status instead
            // This allows registration to succeed even if email fails
            logger.error(
                { err: error, to: options.email, subject: options.subject },
                "Failed to send verification email"
            );
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        logger.error(
            { err: error, to: options.email, subject: options.subject },
            "Failed to send verification email"
        );
        return { success: false, error: error.message };
    }
};

export default sendEmail;
