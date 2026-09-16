import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma"

export const auth = betterAuth({
    baseURL: {
        allowedHosts: [
            "localhost:3000",
            "mahlzeiten-planner.vercel.app",
            "*.vercel.app",
            "10.102.5.191:3000", // dev: phone on LAN
        ],
        protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
    }
});