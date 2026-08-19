"use client";

import useNetworkStatus from "@/hooks/useNetworkStatus";

export default function NetworkStatus() {

    const isOnline = useNetworkStatus();

    return (
        <div
            className={
                isOnline
                    ? "network-status online"
                    : "network-status offline"
            }
        >

            <span className="network-dot"></span>

            <span>
                {isOnline
                    ? "Online"
                    : "Offline"}
            </span>

        </div>
    );
}