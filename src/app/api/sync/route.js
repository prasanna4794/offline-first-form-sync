import { NextResponse } from "next/server";
import { upsertSyncedForm } from "@/lib/server/formService";
import { isNeonConfigured } from "@/lib/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const body = await request.json();
        const { transactionId, formId, payload } = body;

        if (!transactionId || !formId || !payload) {
            return NextResponse.json(
                { success: false, message: "Invalid sync payload." },
                { status: 400 }
            );
        }

        const serverRecord = await upsertSyncedForm({
            formId,
            transactionId,
            payload,
        });

        return NextResponse.json({
            success: true,
            message: "Form synchronized successfully.",
            transactionId,
            serverId: serverRecord.id,
            formId,
            status: "SYNCED",
            storage: isNeonConfigured() ? "neon" : "local-file",
            syncedAt: serverRecord.updatedAt,
        });
    } catch (error) {
        console.error("Server sync error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Server synchronization failed.",
            },
            { status: 500 }
        );
    }
}
