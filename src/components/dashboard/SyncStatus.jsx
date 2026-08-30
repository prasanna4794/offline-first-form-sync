"use client";

import {

    useCallback,
    useEffect,
    useState

} from "react";

import {

    getAllForms

} from "@/lib/db/indexedDB";


export default function SyncStatus() {

    const [

        status,

        setStatus

    ] = useState({

        synced: 0,

        pending: 0,

        syncing: 0,

        lastSync: null

    });


    const loadSyncStatus =
        useCallback(
            async () => {

                const forms =
                    await getAllForms();


                const syncedForms =
                    forms.filter(

                        (form) =>

                            form.status === "SYNCED"

                    );


                const pendingForms =
                    forms.filter(

                        (form) =>

                            form.status === "PENDING"

                    );


                const syncingForms =
                    forms.filter(

                        (form) =>

                            form.status === "SYNCING"

                    );


                const lastSyncedForm =

                    syncedForms

                        .sort(

                            (a, b) =>

                                new Date(
                                    b.updatedAt
                                )

                                -

                                new Date(
                                    a.updatedAt
                                )

                        )[0];


                setStatus({

                    synced:

                        syncedForms.length,

                    pending:

                        pendingForms.length,

                    syncing:

                        syncingForms.length,

                    lastSync:

                        lastSyncedForm?.updatedAt ||
                        null

                });

            },

            []

        );


    useEffect(() => {

        loadSyncStatus();


        const interval =
            setInterval(

                loadSyncStatus,

                1000

            );


        return () =>

            clearInterval(
                interval
            );

    }, [loadSyncStatus]);


    return (

        <section className="dashboard-section">

            <h2>

                Sync Status

            </h2>


            <div className="sync-status-grid">

                <div className="sync-status-item">

                    <span>

                        Synced

                    </span>

                    <strong>

                        {status.synced}

                    </strong>

                </div>


                <div className="sync-status-item">

                    <span>

                        Pending

                    </span>

                    <strong>

                        {status.pending}

                    </strong>

                </div>


                {/* <div className="sync-status-item">

                    <span>

                        Syncing

                    </span>

                    <strong>

                        {status.syncing}

                    </strong>

                </div> */}

            </div>


            {

                status.lastSync && (

                    <p className="last-sync">

                        Last sync:

                        {" "}

                        {

                            new Date(

                                status.lastSync

                            ).toLocaleString()

                        }

                    </p>

                )

            }

        </section>

    );

}