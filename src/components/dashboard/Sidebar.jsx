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
                    <h2>Offline Sync</h2>
                    <span>Engine</span>
                </div>

                <nav className="sidebar-nav">

                    <a className="active" href="#">
                        📊 Dashboard
                    </a>

                    <a href="forms">
                        📝 Forms
                    </a>

                    <a href="drafts">
                        📄 Drafts
                    </a>

                    <a href="#">
                        🔄 Sync Queue
                    </a>

                    <a href="#">
                        🖼️ Media
                    </a>

                    <a href="#">
                        ⚠️ Conflicts
                    </a>

                    <a href="#">
                        📋 Activity
                    </a>

                    <a href="#">
                        ⚙️ Settings
                    </a>

                </nav>

            </aside>
        </>
    );
}