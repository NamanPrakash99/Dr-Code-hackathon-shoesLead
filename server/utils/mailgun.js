import FormData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";

dotenv.config();

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY, // Ensure your .env file has this
  url: "https://api.mailgun.net/v3", // Ensure the URL includes "/v3"
});

export const sendEmail = async () => {
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: ["Kiran kumar biradar <biradarkirankumar18@gmail.com>"],
      subject: "Hello Kiran kumar biradar",
      text: "Congratulations Kiran kumar biradar, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log("✅ Email Sent:", data);
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
  }
};

// Call function to send the email
sendEmail();
