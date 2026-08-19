"use client";

import NetworkStatus from "@/components/network/NetworkStatus";

export default function Header({ onMenuClick }) {
    return (
        <header className="header">

            <div className="header-left">

                <button
                    className="menu-button"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    ☰
                </button>

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Monitor your offline-first form synchronization.
                    </p>
                </div>

            </div>

            <NetworkStatus />

        </header>
    );
}