import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { alphabet, generateRandomString } from "oslo/crypto";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  // This function can be asynchronous
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    try {
      await axios.post(
        "https://email.vly.ai/send_otp",
        {
          to: email,
          otp: token,
          appName: process.env.VLY_APP_NAME || "a vly.ai application",
        },
        {
          headers: {
            "x-api-key": "vlytothemoon2025",
          },
        },
      );
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
