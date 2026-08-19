"use client";

const stats = [
    {
        title: "Total Forms",
        value: "0",
        color: "forms",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
        )
    },
    {
        title: "Drafts",
        value: "0",
        color: "drafts",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9" />
                <path d="M13 2v6h6" />
                <path d="M20.5 12.5a1.5 1.5 0 0 1 0 2.12l-5.5 5.5-3 .88.88-3 5.5-5.5a1.5 1.5 0 0 1 2.12 0z" />
            </svg>
        )
    },
    {
        title: "Pending Sync",
        value: "0",
        color: "sync",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
        )
    },
    {
        title: "Conflicts",
        value: "0",
        color: "conflicts",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
        )
    }
];

export default function StatsCards() {
    return (
        <section className="stats-grid">

            {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>

                    <div className={`stat-icon stat-icon-${stat.color}`}>
                        {stat.icon}
                    </div>

                    <div>
                        <p>{stat.title}</p>
                        <h2>{stat.value}</h2>
                    </div>

                </div>
            ))}

        </section>
    );
}