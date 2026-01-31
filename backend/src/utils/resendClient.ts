import { Resend } from "resend";
import { otpEmail } from "./email";

let resend: Resend | null = null;

const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

export async function sendTestEmail(otpEmail: string) {
  try {
    const client = getResendClient();
    const response = await client.emails.send({
      from: "onboarding@resend.dev", // allowed in test mode
      to: "delivered@resend.dev",      // any email, won't be delivered
      subject: "Test Email - Verify your email",
      html: otpEmail,
    });

    console.log(response);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
