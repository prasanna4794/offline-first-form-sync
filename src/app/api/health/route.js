import { NextResponse } from "next/server";
import { getDatabase, isNeonConfigured } from "@/lib/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await getDatabase();
        return NextResponse.json({
            success: true,
            storage: isNeonConfigured() ? "neon" : "local-file",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error?.message || "Database unavailable" },
            { status: 500 }
        );
    }
}
