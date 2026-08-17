"use client";

const stats = [
    {
        title: "Total Forms",
        value: "0",
        icon: "📝"
    },
    {
        title: "Drafts",
        value: "0",
        icon: "📄"
    },
    {
        title: "Pending Sync",
        value: "0",
        icon: "🔄"
    },
    {
        title: "Conflicts",
        value: "0",
        icon: "⚠️"
    }
];

export default function StatsCards() {
    return (
        <section className="stats-grid">

            {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>

                    <div className="stat-icon">
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