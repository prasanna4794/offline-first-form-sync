"use client";

import {

    useState

} from "react";
import { useRouter } from "next/navigation";


export default function ConflictsPage() {

    const [

        conflicts,

        setConflicts

    ] = useState([]);


    const handleResolve =
        (id) => {

            setConflicts(
                (previous) =>

                    previous.filter(
                        (item) =>
                            item.id !== id
                    )
            );

        };

       const router = useRouter();
    
   const handleBackToDashboard = () => {

        router.push("/");

    };
    return (

        <main className="conflicts-page">


            {/* Header */}

            <div className="conflicts-header">

                <div>

                    <h1>
                        Conflicts
                    </h1>

                    <p>
                        Review and resolve synchronization conflicts.
                    </p>

                </div>
                <div>
 <button
                        type="button"
                        className="secondary-button"
                        onClick={handleBackToDashboard}
                    >
                        Back
                    </button>
                </div>

            </div>


            {/* Summary */}

            <div className="conflicts-summary-card">

                <span>
                    Total Conflicts
                </span>

                <strong>

                    {conflicts.length}

                </strong>

            </div>


            {/* Content */}

            {

                conflicts.length === 0

                    ? (

                        <div className="conflicts-empty-state">

                            <div className="conflict-icon">

                                ✓

                            </div>


                            <h3>
                                No conflicts found
                            </h3>


                            <p>
                                Everything is synchronized correctly.
                            </p>

                        </div>

                    )

                    : (

                        <div className="conflicts-list">

                            {

                                conflicts.map(
                                    (conflict) => (

                                        <div
                                            className="conflict-card"
                                            key={conflict.id}
                                        >

                                            <div>

                                                <h3>

                                                    {
                                                        conflict.formId
                                                    }

                                                </h3>


                                                <p>

                                                    {
                                                        conflict.message
                                                    }

                                                </p>

                                            </div>


                                            <button

                                                className="resolve-conflict-button"

                                                onClick={() =>
                                                    handleResolve(
                                                        conflict.id
                                                    )
                                                }

                                            >

                                                Resolve

                                            </button>

                                        </div>

                                    )
                                )

                            }

                        </div>

                    )

            }

        </main>

    );

}