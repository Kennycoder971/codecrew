import nodemailer from "nodemailer";

async function sendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });
  } catch (error) {}
}

export default sendEmail;
