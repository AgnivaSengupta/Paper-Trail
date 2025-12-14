import { Resend } from "resend";
import { otpEmail } from "./email";

const resend = new Resend(process.env.RESEND_API_KEY); // test key

export async function sendTestEmail(otpEmail: string) {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev", // allowed in test mode
    to: "delivered@resend.dev",      // any email, won't be delivered
    subject: "Test Email - Verify your email",
    html: otpEmail,
  });

  console.log(response);
}
