"use client";

import {

    useCallback,
    useEffect,
    useState

} from "react";

import {

    getAllAuditLogs

} from "@/lib/sync/auditLog";


export default function RecentActivity() {

    const [

        activities,

        setActivities

    ] = useState([]);


    const loadActivities =
        useCallback(
            async () => {

                try {

                    const logs =
                        await getAllAuditLogs();


                    const sortedLogs =

                        logs

                            .sort(

                                (a, b) =>

                                    new Date(
                                        b.updatedAt
                                    )

                                    -

                                    new Date(
                                        a.updatedAt
                                    )

                            )

                            .slice(
                                0,
                                5
                            );


                    setActivities(
                        sortedLogs
                    );

                } catch (error) {

                    console.error(

                        "Failed to load activity:",

                        error

                    );

                }

            },

            []

        );


    useEffect(() => {

        loadActivities();


        const interval =
            setInterval(

                loadActivities,

                1000

            );


        return () =>

            clearInterval(
                interval
            );

    }, [loadActivities]);


    return (

        <section className="dashboard-section">

            <h2>

                Recent Activity

            </h2>


            <div className="activity-list">

                {

                    activities.length === 0 ? (

                        <div className="empty-box">

                            <p>

                                No recent activity.

                            </p>

                        </div>

                    ) : (

                        activities.map(

                            (activity) => (

                                <div

                                    className="activity-item"

                                    key={activity.id}

                                >

                                    <div>

                                        <strong>

                                            {activity.event}

                                        </strong>


                                        <p>

                                            Form ID:

                                            {" "}

                                            {

                                                activity.formId

                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <span>

                                            {

                                                activity.status

                                            }

                                        </span>

                                    </div>

                                </div>

                            )

                        )

                    )

                }

            </div>

        </section>

    );

}