import { NextResponse } from "next/server";
import { getDatabase, isUsingNeon } from "@/lib/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const database = await getDatabase();

        return NextResponse.json({
            success: true,
            service: "offline-first-form-sync",
            environment: process.env.VERCEL ? "vercel" : "local",
            storage: isUsingNeon() ? "neon-postgres" : "local-json",
            formCount: database.forms.length,
        });
    } catch (error) {
        console.error("Health check failed:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Health check failed.",
            },
            { status: 500 }
        );
    }
}
