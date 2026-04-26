import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { fromNodeHeaders } from "better-auth/node";
import { MongoClient } from "mongodb";
import type { Request } from "express";

const client = new MongoClient(process.env.MONGO_URL!);
const isProduction = process.env.NODE_ENV === "production";

const normalizeOrigin = (value?: string | null) => {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const frontendOrigin = normalizeOrigin(process.env.FRONTEND_URL);
const frontendHost = frontendOrigin ? new URL(frontendOrigin).hostname : null;
const vercelProjectPrefix = frontendHost?.endsWith(".vercel.app")
  ? frontendHost.replace(".vercel.app", "")
  : null;

const trustedOrigins = [
  "http://localhost:5173",
  frontendOrigin,
  process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ?.split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin)),
  vercelProjectPrefix ? `https://${vercelProjectPrefix}*.vercel.app` : null,
].flat().filter((origin): origin is string => Boolean(origin));

// Connect the raw MongoClient so Better Auth can use it
client.connect().catch((err) => {
  console.error("Better Auth MongoClient connection failed:", err);
  process.exit(1);
});

const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    usePlural: true, // use plural collection names (users, sessions, etc.)
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.OAUTH_CLIENT_ID as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    },
  },
  trustedOrigins,
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction,
      httpOnly: true,
    },
  },
});

export async function getSession(req: Request) {
  const result = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return result;
}
