"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsCards from "./StatsCards";

import SyncStatus from "./SyncStatus";

import RecentActivity from "./RecentActivity";

export default function Dashboard() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="dashboard-layout">

            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <main className="dashboard-main">

                <Header
                    onMenuClick={handleMenuClick}
                />

                <StatsCards />

           <SyncStatus />


                <RecentActivity />

            </main>

        </div>
    );
}