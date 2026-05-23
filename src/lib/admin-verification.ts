import crypto from "crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const ADMIN_VERIFICATION_PREFIX = "admin-email-verification:";

function getAppUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass || !from) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
    from,
  };
}

export function isAdminEmail(email: string) {
  return email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}

export async function sendAdminVerificationEmail(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const identifier = `${ADMIN_VERIFICATION_PREFIX}${email.toLowerCase()}`;
  const expires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  });

  const verificationUrl = `${getAppUrl()}/api/auth/verify-admin-email/${token}`;
  const smtp = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject: "Verify your RoboFest admin login",
    text: `Click this link to verify your admin login: ${verificationUrl}\n\nThis link expires in 30 minutes.`,
    html: `
      <p>Click the button below to verify your RoboFest admin login.</p>
      <p><a href="${verificationUrl}">Verify admin login</a></p>
      <p>This link expires in 30 minutes.</p>
    `,
  });
}

export async function verifyAdminEmailToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || !record.identifier.startsWith(ADMIN_VERIFICATION_PREFIX)) {
    return false;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    });
    return false;
  }

  const email = record.identifier.slice(ADMIN_VERIFICATION_PREFIX.length);

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { token },
    }),
  ]);

  return true;
}
