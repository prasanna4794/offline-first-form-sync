"use client";

import {

    useCallback,
    useEffect,
    useState

} from "react";

import {

    getAllAuditLogs

} from "@/lib/sync/auditLog";

import { useRouter } from "next/navigation";

export default function ActivityPage() {

    const [

        activities,

        setActivities

    ] = useState([]);

       const router = useRouter();
    
   const handleBackToDashboard = () => {

        router.push("/");

    };
    const [

        loading,

        setLoading

    ] = useState(true);


    const loadActivities =
        useCallback(
            async () => {

                try {

                    const logs =
                        await getAllAuditLogs();


                    const sortedLogs =
                        [...logs].sort(
                            (a, b) => {

                                return new Date(
                                    b.updatedAt ||
                                    b.createdAt
                                )

                                -

                                new Date(
                                    a.updatedAt ||
                                    a.createdAt
                                );

                            }
                        );


                    setActivities(
                        sortedLogs
                    );

                } catch (error) {

                    console.error(
                        "Failed to load activities:",
                        error
                    );

                } finally {

                    setLoading(false);

                }

            },

            []

        );


    useEffect(() => {

        loadActivities();


        const interval =
            setInterval(
                loadActivities,
                2000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [loadActivities]);


    return (

        <main className="activity-page">


            {/* Header */}

            <div className="activity-header">

                <div>

                    <h1>
                        Activity
                    </h1>

                    <p>
                        View recent synchronization activity.
                    </p>

                </div>

               <div className="refersh">
                 <button
                    onClick={loadActivities}
                >

                    Refresh

                </button>
 <button
                        type="button"
                        className="secondary-button"
                        onClick={handleBackToDashboard}
                    >
                        Back
                    </button>

                </div>
               

            </div>


            {

                loading

                    ? (

                        <p className="activity-loading">

                            Loading activity...

                        </p>

                    )

                    : activities.length === 0

                        ? (

                            <div className="activity-empty-state">

                                <h3>
                                    No activity found
                                </h3>

                                <p>
                                    Your recent activity will appear here.
                                </p>

                            </div>

                        )

                        : (

                            <div className="activity-page-list">

                                {

                                    activities.map(
                                        (activity) => {

                                            const date =
                                                activity.updatedAt ||
                                                activity.createdAt;


                                            return (

                                                <div

                                                    className="activity-page-item"

                                                    key={
                                                        activity.id
                                                    }

                                                >

                                                    <div className="activity-page-icon">

                                                        ↻

                                                    </div>


                                                    <div className="activity-page-content">

                                                        <strong>

                                                            {
                                                                activity.event
                                                            }

                                                        </strong>


                                                        <p>

                                                            Form ID:

                                                            {" "}

                                                            {
                                                                activity.formId
                                                            }

                                                        </p>

                                                    </div>


                                                    <div className="activity-page-meta">

                                                        <span

                                                            className={`activity-status activity-${activity.status?.toLowerCase()}`}

                                                        >

                                                            {
                                                                activity.status
                                                            }

                                                        </span>


                                                        <small>

                                                            {

                                                                date

                                                                    ? new Date(
                                                                        date
                                                                    ).toLocaleString()

                                                                    : "-"

                                                            }

                                                        </small>

                                                    </div>

                                                </div>

                                            );

                                        }

                                    )

                                }

                            </div>

                        )

            }

        </main>

    );

}