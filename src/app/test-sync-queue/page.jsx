"use client";

import { useEffect, useState } from "react";

import {
    addToSyncQueue,
    getAllSyncQueueItems,
    getPendingSyncItems,
} from "@/lib/sync/syncQueue";
import {
    processSyncQueue
} from "@/lib/sync/syncProcessor";

export default function TestSyncQueue() {
    const [items, setItems] = useState([]);

    async function loadQueue() {
        const queue =
            await getAllSyncQueueItems();

        setItems(queue);
    }

    async function createTestTransaction() {
        await addToSyncQueue({
            formId: "form-test-001",

            operation: "UPDATE",

            payload: {
                fullName: "Prasanna",
                email: "prasanna4794@gmail.com",
            },

            priority: "HIGH",
        });

        await loadQueue();
    }

    async function loadPendingItems() {
        const pending =
            await getPendingSyncItems();

        console.log(
            "Pending Queue:",
            pending
        );
    }

    useEffect(() => {
        loadQueue();
    }, []);

    return (
        <main style={{ padding: "30px" }}>
            <h1>Sync Queue Test</h1>

            <br />

            <button
                onClick={createTestTransaction}
                style={{
                    padding: "10px 15px",
                    marginRight: "10px",
                }}
            >
                Add Test Transaction
            </button>

            <button
                onClick={loadPendingItems}
                style={{
                    padding: "10px 15px",
                }}
            >
                Check Pending Queue
            </button>

            <hr
                style={{
                    margin: "25px 0",
                }}
            />

            <h2>Queue Items</h2>

            {items.length === 0 && (
                <p>No queue items found.</p>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginTop: "15px",
                    }}
                >
                    <p>
                        <strong>ID:</strong>{" "}
                        {item.id}
                    </p>

                    <p>
                        <strong>Form:</strong>{" "}
                        {item.formId}
                    </p>

                    <p>
                        <strong>Operation:</strong>{" "}
                        {item.operation}
                    </p>

                    <p>
                        <strong>Priority:</strong>{" "}
                        {item.priority}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {item.status}
                    </p>

                    <p>
                        <strong>Retry Count:</strong>{" "}
                        {item.retryCount}
                    </p>
                    <button
    onClick={async () => {
        const result =
            await processSyncQueue();

        console.log(
            "Sync Result:",
            result
        );

        await loadQueue();
    }}
>
    Sync Pending Items
</button>
                </div>
                
            ))}
        </main>
    );
}