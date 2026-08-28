"use client";

export default function Sidebar({ isOpen, setIsOpen }) {
    return (
        <>
            {/* Navbar Toggler */}
            <button
                className="navbar-toggler"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? "show" : ""}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>

                <div className="sidebar-logo">
                    <svg
                        className="sidebar-logo-icon"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
                        <path
                            d="M11 13a5 5 0 0 1 9-3"
                            stroke="#0a1a1a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M18 10l2-1.5v3z"
                            fill="#0a1a1a"
                        />
                        <path
                            d="M21 19a5 5 0 0 1-9 3"
                            stroke="#0a1a1a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M14 22l-2 1.5v-3z"
                            fill="#0a1a1a"
                        />
                        <defs>
                            <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#2dd4bf" />
                                <stop offset="100%" stopColor="#0d9488" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="sidebar-logo-text">
                        <h2>Offline Sync</h2>
                        <span>Engine</span>
                    </div>
                </div>

                <nav className="sidebar-nav">

                    {/* Dashboard - grid/layout icon */}
                    <a className="active" href="">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="9" rx="1" />
                            <rect x="14" y="3" width="7" height="5" rx="1" />
                            <rect x="14" y="12" width="7" height="9" rx="1" />
                            <rect x="3" y="16" width="7" height="5" rx="1" />
                        </svg>
                        Dashboard
                    </a>

                    {/* Forms - document with lines */}
                    <a href="forms">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <line x1="8" y1="13" x2="16" y2="13" />
                            <line x1="8" y1="17" x2="13" y2="17" />
                        </svg>
                        Forms
                    </a>

                    {/* Drafts - document with pencil */}
                    <a href="drafts">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9" />
                            <path d="M13 2v6h6" />
                            <path d="M20.5 12.5a1.5 1.5 0 0 1 0 2.12l-5.5 5.5-3 .88.88-3 5.5-5.5a1.5 1.5 0 0 1 2.12 0z" />
                        </svg>
                        Drafts
                    </a>

                    {/* Sync Queue - refresh arrows */}
                    <a href="/sync-queue">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Sync Queue
                    </a>

                    {/* Media - image with mountain + sun */}
                    <a href="/media">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                        </svg>
                        Media
                    </a>

                    {/* Conflicts - warning triangle */}
                    <a href="/conflicts">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
                        </svg>
                        Conflicts
                    </a>

                    {/* Activity - clipboard with check */}
                    <a href="/activity">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="3" width="16" height="18" rx="2" />
                            <path d="M9 3h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                            <path d="M8 13l2.5 2.5L16 10" />
                        </svg>
                        Activity
                    </a>

                    {/* Settings - gear */}
                    <a href="/settings">
                        <svg className="sidebar-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                    </a>

                </nav>

            </aside>
        </>
    );
}