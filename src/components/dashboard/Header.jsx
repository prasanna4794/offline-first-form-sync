"use client";

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

            <div className="network-status">
                <span className="status-dot"></span>
                Online
            </div>

        </header>
    );
}