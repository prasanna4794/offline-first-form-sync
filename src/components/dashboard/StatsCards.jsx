"use client";

import {

    useCallback,
    useEffect,
    useState

} from "react";

import {

    getAllForms

} from "@/lib/db/indexedDB";


const statsConfig = [

    {
        key: "totalForms",

        title: "Total Forms",

        color: "forms",

        icon: "📄"
    },

    {
        key: "drafts",

        title: "Drafts",

        color: "drafts",

        icon: "📝"
    },

    {
        key: "pendingSync",

        title: "Pending Sync",

        color: "sync",

        icon: "🔄"
    },

    {
        key: "conflicts",

        title: "Conflicts",

        color: "conflicts",

        icon: "⚠️"
    }

];


export default function StatsCards() {

    const [

        stats,

        setStats

    ] = useState({

        totalForms: 0,

        drafts: 0,

        pendingSync: 0,

        conflicts: 0

    });


    const loadStats =
        useCallback(
            async () => {

                try {

                    const forms =
                        await getAllForms();


                    const getStatus =
                        (form) =>

                            (
                                form.status || ""
                            ).toUpperCase();


                    setStats({

                        /*
                        |----------------------------------
                        | Total Forms
                        |----------------------------------
                        */

                        totalForms:

                            forms.length,


                        /*
                        |----------------------------------
                        | Drafts
                        |----------------------------------
                        */

                        drafts:

                            forms.filter(

                                (form) =>

                                    getStatus(form)
                                        === "DRAFT"

                            ).length,


                        /*
                        |----------------------------------
                        | Pending Sync
                        |----------------------------------
                        */

                        pendingSync:

                            forms.filter(

                                (form) => {

                                    const status =
                                        getStatus(form);

                                    return (

                                        status === "PENDING" ||

                                        status === "SYNCING"

                                    );

                                }

                            ).length,


                        /*
                        |----------------------------------
                        | Conflicts
                        |----------------------------------
                        */

                        conflicts:

                            forms.filter(

                                (form) =>

                                    getStatus(form)
                                        === "CONFLICT"

                            ).length

                    });

                } catch (error) {

                    console.error(

                        "Failed to load dashboard stats:",

                        error

                    );

                }

            },

            []

        );


    useEffect(() => {

        loadStats();


        const interval =
            setInterval(

                loadStats,

                1000

            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [loadStats]);


    return (

        <section className="stats-grid">

            {

                statsConfig.map(

                    (stat) => (

                        <div

                            className="stat-card"

                            key={stat.key}

                        >

                            <div

                                className={`stat-icon stat-icon-${stat.color}`}

                            >

                                {stat.icon}

                            </div>


                            <div>

                                <p>

                                    {stat.title}

                                </p>


                                <h2>

                                    {

                                        stats[
                                            stat.key
                                        ]

                                    }

                                </h2>

                            </div>

                        </div>

                    )

                )

            }

        </section>

    );

}