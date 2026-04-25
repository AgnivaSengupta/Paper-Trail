import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { fromNodeHeaders } from "better-auth/node";
import { MongoClient } from "mongodb";
import type { Request } from "express";

const client = new MongoClient(process.env.MONGO_URL!);

// Connect the raw MongoClient so Better Auth can use it
client.connect().catch((err) => {
  console.error("Better Auth MongoClient connection failed:", err);
  process.exit(1);
});

const db = client.db();

export const auth = betterAuth({
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
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:5173",
  ],
});

export async function getSession(req: Request) {
  const result = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return result;
}