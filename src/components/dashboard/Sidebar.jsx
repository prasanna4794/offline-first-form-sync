"use client";

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>

                <div className="sidebar-logo">
                    <h2>Offline Sync</h2>
                    <span>Engine</span>
                </div>

                <nav className="sidebar-nav">

                    <a className="active" href="#">
                        📊 Dashboard
                    </a>

                    <a href="#">
                        📝 Forms
                    </a>

                    <a href="#">
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