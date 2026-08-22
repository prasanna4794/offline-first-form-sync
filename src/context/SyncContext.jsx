"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    processSyncQueue
} from "@/lib/sync/syncProcessor";

const SyncContext =
    createContext(null);

export function SyncProvider({
    children
}) {

    const [isOnline, setIsOnline] =
        useState(true);

    const [syncStatus, setSyncStatus] =
        useState("idle");

    const [lastSyncTime, setLastSyncTime] =
        useState(null);

    const [syncedCount, setSyncedCount] =
        useState(0);

    const [error, setError] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Update Network Status
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const updateNetworkStatus = () => {

            setIsOnline(
                navigator.onLine
            );

        };


        updateNetworkStatus();


        window.addEventListener(
            "online",
            updateNetworkStatus
        );

        window.addEventListener(
            "offline",
            updateNetworkStatus
        );


        return () => {

            window.removeEventListener(
                "online",
                updateNetworkStatus
            );

            window.removeEventListener(
                "offline",
                updateNetworkStatus
            );

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Automatic Sync
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!isOnline) {

            setSyncStatus("offline");

            return;
        }


        const runSync = async () => {

            try {

                setSyncStatus("syncing");

                setError(null);


                const result =
                    await processSyncQueue();


                setSyncedCount(
                    result.synced || 0
                );


                setLastSyncTime(
                    new Date()
                );


                setSyncStatus(
                    "synced"
                );

            } catch (error) {

                console.error(
                    "Sync failed:",
                    error
                );

                setError(
                    error.message
                );

                setSyncStatus(
                    "error"
                );

            }

        };


        runSync();

    }, [isOnline]);


    return (

        <SyncContext.Provider
            value={{
                isOnline,

                syncStatus,

                lastSyncTime,

                syncedCount,

                error,
            }}
        >
            {children}
        </SyncContext.Provider>

    );
}


/*
|--------------------------------------------------------------------------
| Custom Hook
|--------------------------------------------------------------------------
*/

export function useSync() {

    const context =
        useContext(
            SyncContext
        );

    if (!context) {

        throw new Error(
            "useSync must be used inside SyncProvider"
        );

    }

    return context;
}