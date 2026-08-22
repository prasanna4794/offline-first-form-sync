"use client";

import { useEffect } from "react";

import {
    processSyncQueue
} from "@/lib/sync/syncProcessor";

export default function useOnlineSync() {

    useEffect(() => {

        /*
        |--------------------------------------------------------------------------
        | Sync When Application Starts
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Internet Connection Restored
        |--------------------------------------------------------------------------
        */

        const handleOnline = () => {

            console.log(
                "Internet connection restored."
            );

            syncIfOnline();
        };


        /*
        |--------------------------------------------------------------------------
        | Listen For Browser Online Event
        |--------------------------------------------------------------------------
        */

        window.addEventListener(
            "online",
            handleOnline
        );


        /*
        |--------------------------------------------------------------------------
        | Initial Check
        |--------------------------------------------------------------------------
        */

        syncIfOnline();


        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {

            window.removeEventListener(
                "online",
                handleOnline
            );

        };

    }, []);
}