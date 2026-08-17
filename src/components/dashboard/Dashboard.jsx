"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsCards from "./StatsCards";

export default function Dashboard() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="dashboard-layout">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={handleSidebarClose}
            />

            <main className="dashboard-main">

                <Header
                    onMenuClick={handleMenuClick}
                />

                <StatsCards />

                <section className="dashboard-section">

                    <h2>Sync Status</h2>

                    <div className="empty-box">
                        <p>
                            No synchronization activity yet.
                        </p>
                    </div>

                </section>

                <section className="dashboard-section">

                    <h2>Recent Activity</h2>

                    <div className="empty-box">
                        <p>
                            No recent activity.
                        </p>
                    </div>

                </section>

            </main>

        </div>
    );
}