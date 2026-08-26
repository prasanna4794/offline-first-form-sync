"use client";

import { useEffect } from "react";

import {
    processSyncQueue
} from "@/lib/sync/syncProcessor";

export default function useOnlineSync() {

    useEffect(() => {

        const syncIfOnline = async () => {

            if (!navigator.onLine) {

                console.log(
                    "Offline - sync skipped."
                );

                return;
            }

            try {

                console.log(
                    "Online - starting sync..."
                );

                const result =
                    await processSyncQueue();

                console.log(
                    "Automatic sync completed:",
                    result
                );

            } catch (error) {

                console.error(
                    "Automatic sync failed:",
                    error
                );
            }
        };

        const handleOnline = () => {

            console.log(
                "Internet connection restored."
            );

            syncIfOnline();
        };

        window.addEventListener(
            "online",
            handleOnline
        );

        syncIfOnline();

        return () => {

            window.removeEventListener(
                "online",
                handleOnline
            );

        };

    }, []);
}