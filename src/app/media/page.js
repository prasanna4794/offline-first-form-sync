"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MediaPage() {

    const [searchTerm, setSearchTerm] =
        useState("");


    const mediaItems = [];


    const filteredMedia =
        mediaItems.filter(
            (item) =>
                item.name
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );
       const router = useRouter();
    
   const handleBackToDashboard = () => {

        router.push("/");

    };

    return (

        <main className="media-page">

            {/* Header */}

            <div className="media-header d-flex justify-content-between gap-2">

                <div>

                    <h1>
                        Media
                    </h1>

                    <p>
                        Manage uploaded files and media attachments.
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

            <div className="media-summary-grid">

                <div className="media-summary-card">

                    <span>
                        Total Media
                    </span>

                    <strong>
                        {mediaItems.length}
                    </strong>

                </div>


                <div className="media-summary-card">

                    <span>
                        Synced
                    </span>

                    <strong>
                        {
                            mediaItems.filter(
                                (item) =>
                                    item.status === "SYNCED"
                            ).length
                        }
                    </strong>

                </div>


                <div className="media-summary-card">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {
                            mediaItems.filter(
                                (item) =>
                                    item.status === "PENDING"
                            ).length
                        }
                    </strong>

                </div>

            </div>


            {/* Search */}

            <div className="media-controls">

                <input

                    type="text"

                    placeholder="Search media..."

                    value={searchTerm}

                    onChange={(event) =>
                        setSearchTerm(
                            event.target.value
                        )
                    }

                />

            </div>


            {/* Media Content */}

            {

                filteredMedia.length === 0

                    ? (

                        <div className="media-empty-state">

                            <h3>
                                No media found
                            </h3>

                            <p>
                                Uploaded media files will appear here.
                            </p>

                        </div>

                    )

                    : (

                        <div className="media-grid">

                            {

                                filteredMedia.map(
                                    (item) => (

                                        <div
                                            className="media-card"
                                            key={item.id}
                                        >

                                            <div className="media-preview">

                                                📄

                                            </div>


                                            <h3>

                                                {item.name}

                                            </h3>


                                            <p>

                                                {item.type}

                                            </p>


                                            <span
                                                className={`media-status media-${item.status?.toLowerCase()}`}
                                            >

                                                {item.status}

                                            </span>

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