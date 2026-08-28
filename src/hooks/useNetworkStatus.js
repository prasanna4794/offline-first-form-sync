"use client";

import { useEffect, useState } from "react";

import {
    getNetworkStatus,
    subscribeToNetworkStatus
} from "@/lib/network/networkStatus";

export default function useNetworkStatus() {

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {

        setIsOnline(
            getNetworkStatus()
        );

        const unsubscribe =
            subscribeToNetworkStatus(
                setIsOnline
            );

        return unsubscribe;

    }, []);

    return isOnline;
}