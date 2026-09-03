"use client";

import {

    useCallback,
    useEffect,
    useMemo,
    useState

} from "react";

import {

    getAllSyncItems,

    retrySyncItem,

    deleteSyncItem

} from "@/lib/sync/syncQueue";

import {

    processSyncQueue

} from "@/lib/sync/syncProcessor";

import { useRouter } from "next/navigation";

export default function SyncQueuePage() {

    const [

        syncItems,

        setSyncItems

    ] = useState([]);


    const [

        loading,

        setLoading

    ] = useState(true);


    const [

        searchTerm,

        setSearchTerm

    ] = useState("");


    const [

        statusFilter,

        setStatusFilter

    ] = useState("ALL");


    const [

        priorityFilter,

        setPriorityFilter

    ] = useState("ALL");


    const [

        syncing,

        setSyncing

    ] = useState(false);
        const router = useRouter();
    
   const handleBackToDashboard = () => {

        router.push("/");

    };

    /*
    |------------------------------------------
    | Load Queue
    |------------------------------------------
    */

    const loadSyncQueue =
        useCallback(
            async () => {

                try {

                    const items =
                        await getAllSyncItems();


                    const sortedItems =
                        [...items].sort(

                            (a, b) =>

                                new Date(
                                    b.updatedAt
                                )

                                -

                                new Date(
                                    a.updatedAt
                                )

                        );


                    setSyncItems(
                        sortedItems
                    );

                } catch (error) {

                    console.error(
                        "Failed to load sync queue:",
                        error
                    );

                } finally {

                    setLoading(false);

                }

            },

            []

        );


    useEffect(() => {

        loadSyncQueue();


        const interval =
            setInterval(

                loadSyncQueue,

                1500

            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [loadSyncQueue]);


    /*
    |------------------------------------------
    | Manual Sync
    |------------------------------------------
    */

    const handleSync =
        async () => {

            if (syncing) {
                return;
            }


            try {

                setSyncing(true);


                await processSyncQueue();


                await loadSyncQueue();

            } catch (error) {

                console.error(
                    "Manual sync failed:",
                    error
                );

            } finally {

                setSyncing(false);

            }

        };


    /*
    |------------------------------------------
    | Retry Failed Item
    |------------------------------------------
    */

    const handleRetry =
        async (id) => {

            try {

                await retrySyncItem(
                    id
                );


                await loadSyncQueue();


                await handleSync();

            } catch (error) {

                console.error(
                    "Retry failed:",
                    error
                );

            }

        };


    /*
    |------------------------------------------
    | Delete Queue Item
    |------------------------------------------
    */

    const handleDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Remove this item from the sync queue?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteSyncItem(
                    id
                );


                await loadSyncQueue();

            } catch (error) {

                console.error(
                    "Failed to delete sync item:",
                    error
                );

            }

        };


    /*
    |------------------------------------------
    | Filter Items
    |------------------------------------------
    */

    const filteredItems =
        useMemo(
            () => {

                const search =
                    searchTerm.toLowerCase();


                return syncItems.filter(
                    (item) => {

                        const matchesSearch =

                            item.formId
                                ?.toLowerCase()
                                .includes(search)

                            ||

                            item.operation
                                ?.toLowerCase()
                                .includes(search)

                            ||

                            item.id
                                ?.toLowerCase()
                                .includes(search);


                        const matchesStatus =

                            statusFilter === "ALL"

                            ||

                            item.status ===
                            statusFilter;


                        const matchesPriority =

                            priorityFilter === "ALL"

                            ||

                            item.priority ===
                            priorityFilter;


                        return (

                            matchesSearch

                            &&

                            matchesStatus

                            &&

                            matchesPriority

                        );

                    }

                );

            },

            [

                syncItems,

                searchTerm,

                statusFilter,

                priorityFilter

            ]

        );


    /*
    |------------------------------------------
    | Queue Counts
    |------------------------------------------
    */

    const counts =
        useMemo(
            () => ({

                total:
                    syncItems.length,

                pending:
                    syncItems.filter(
                        (item) =>
                            item.status === "PENDING"
                    ).length,

                syncing:
                    syncItems.filter(
                        (item) =>
                            item.status === "SYNCING"
                    ).length,

                synced:
                    syncItems.filter(
                        (item) =>
                            item.status === "SYNCED"
                    ).length,

                

            }),

            [syncItems]

        );


    if (loading) {

        return (

            <main className="sync-queue-page">

                <p>
                    Loading sync queue...
                </p>

            </main>

        );

    }


    return (

        <main className="sync-queue-page">


            {/* Header */}

            <div className="sync-queue-header">

                <div>

                    <h1>
                        Sync Queue
                    </h1>

                    <p>
                        Monitor and manage form synchronization.
                    </p>

                </div>

 <div className="draft-header-actions">
 <button

                    className="sync-now-button"

                    onClick={handleSync}

                    disabled={syncing}

                >

                    {

                        syncing

                            ? "Syncing..."

                            : "Sync Now"

                    }

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


            {/* Statistics */}

            <div className="sync-summary-grid">

                <div className="sync-summary-card">

                    <span>
                        Total
                    </span>

                    <strong>
                        {counts.total}
                    </strong>

                </div>


                <div className="sync-summary-card">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {counts.pending}
                    </strong>

                </div>


                <div className="sync-summary-card">

                    <span>
                        Syncing
                    </span>

                    <strong>
                        {counts.syncing}
                    </strong>

                </div>


                <div className="sync-summary-card">

                    <span>
                        Synced
                    </span>

                    <strong>
                        {counts.synced}
                    </strong>

                </div>

            </div>


            {/* Controls */}

            <div className="sync-queue-controls">


                <input

                    type="text"

                    placeholder="Search form ID or operation..."

                    value={searchTerm}

                    onChange={(event) =>
                        setSearchTerm(
                            event.target.value
                        )
                    }

                />


                <select

                    value={statusFilter}

                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }

                >

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="SYNCING">
                        Syncing
                    </option>

                    <option value="SYNCED">
                        Synced
                    </option>

                    <option value="FAILED">
                        Failed
                    </option>

                </select>


                <select

                    value={priorityFilter}

                    onChange={(event) =>
                        setPriorityFilter(
                            event.target.value
                        )
                    }

                >

                    <option value="ALL">
                        All Priority
                    </option>

                    <option value="HIGH">
                        High
                    </option>

                    <option value="MEDIUM">
                        Medium
                    </option>

                    <option value="LOW">
                        Low
                    </option>

                </select>


                <button
                    onClick={loadSyncQueue}
                >
                    Refresh
                </button>

            </div>


            {/* Table */}

            {

                filteredItems.length === 0

                    ? (

                        <div className="sync-empty-state">

                            <h3>
                                No sync items found
                            </h3>

                            <p>
                                Your synchronization queue is empty.
                            </p>

                        </div>

                    )

                    : (

                        <div className="sync-table-wrapper">

                            <table className="sync-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Form ID
                                        </th>

                                        <th>
                                            Operation
                                        </th>

                                        <th>
                                            Priority
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Retries
                                        </th>

                                        <th>
                                            Updated
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {

                                        filteredItems.map(
                                            (item) => (

                                                <tr
                                                    key={item.id}
                                                >

                                                    <td>

                                                        <span className="sync-form-id">

                                                            {

                                                                item.formId

                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {

                                                            item.operation

                                                        }

                                                    </td>


                                                    <td>

                                                        <span

                                                            className={`priority-badge priority-${item.priority?.toLowerCase()}`}

                                                        >

                                                            {

                                                                item.priority

                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span

                                                            className={`sync-status-badge status-${item.status?.toLowerCase()}`}

                                                        >

                                                            {

                                                                item.status

                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {

                                                            item.retryCount || 0

                                                        }

                                                    </td>


                                                    <td>

                                                        {

                                                            item.updatedAt

                                                                ? new Date(
                                                                    item.updatedAt
                                                                ).toLocaleString()

                                                                : "-"

                                                        }

                                                    </td>


                                                    <td>

                                                        <div className="sync-actions">

                                                            {

                                                                item.status === "FAILED"

                                                                && (

                                                                    <button

                                                                        className="retry-button"

                                                                        onClick={() =>
                                                                            handleRetry(
                                                                                item.id
                                                                            )
                                                                        }

                                                                    >

                                                                        Retry

                                                                    </button>

                                                                )

                                                            }


                                                            <button

                                                                className="delete-sync-button"

                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id
                                                                    )
                                                                }

                                                            >

                                                                Remove

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )

                                        )

                                    }

                                </tbody>

                            </table>

                        </div>

                    )

            }

        </main>

    );

}