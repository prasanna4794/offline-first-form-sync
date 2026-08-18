"use client";

import { useEffect, useState } from "react";

import { getAllForms, deleteForm } from "@/lib/db/indexedDB";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function DraftsPage() {

    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOption, setSortOption] = useState("updated");

    useEffect(() => {

        const loadDrafts = async () => {

            try {

                const forms = await getAllForms();

                setDrafts(forms);

            } catch (error) {

                console.error(
                    "Failed to load drafts:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadDrafts();

    }, []);

    const filteredDrafts = drafts
        .filter((draft) => {

            const search = searchTerm.toLowerCase();

            const name =
                draft.data?.fullName?.toLowerCase() || "";

            const email =
                draft.data?.email?.toLowerCase() || "";

            const matchesSearch =
                name.includes(search) ||
                email.includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                draft.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {

            if (sortOption === "updated") {

                return new Date(b.updatedAt) -
                    new Date(a.updatedAt);

            }

            if (sortOption === "created") {

                return new Date(b.createdAt) -
                    new Date(a.createdAt);

            }

            if (sortOption === "name") {

                const nameA =
                    a.data?.fullName || "";

                const nameB =
                    b.data?.fullName || "";

                return nameA.localeCompare(nameB);

            }

            return 0;
        });

    const handleDelete = async (formId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this draft?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteForm(formId);

            setDrafts((previousDrafts) =>
                previousDrafts.filter(
                    (draft) => draft.id !== formId
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete draft:",
                error
            );

        }
    };

    const handleEdit = (formId) => {
        router.push(`/forms?draftId=${formId}`);
    };

    if (loading) {

        return (
            <main className="drafts-page">
                <p>Loading drafts...</p>
            </main>
        );

    }

    return (
        <main className="drafts-page">

            <div className="drafts-header">

                <div>
                    <h1>Drafts</h1>

                    <p>
                        Manage your locally saved form drafts.
                    </p>
                </div>

                <span className="draft-count">
                    {filteredDrafts.length} Drafts
                </span>

            </div>
            <div className="draft-controls">

                <div className="draft-search">

                    <input
                        type="text"
                        placeholder="Search drafts..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>

                <div className="draft-filter">

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >
                        <option value="all">
                            All Status
                        </option>

                        <option value="draft">
                            Draft
                        </option>

                        <option value="synced">
                            Synced
                        </option>

                        <option value="pending">
                            Pending
                        </option>
                    </select>

                </div>

                <div className="draft-sort">

                    <select
                        value={sortOption}
                        onChange={(event) =>
                            setSortOption(event.target.value)
                        }
                    >
                        <option value="updated">
                            Recently Updated
                        </option>

                        <option value="created">
                            Recently Created
                        </option>

                        <option value="name">
                            Name A-Z
                        </option>

                    </select>

                </div>

            </div>

            {drafts.length === 0 ? (

                <div className="empty-drafts">

                    <div className="empty-icon">
                        🔍
                    </div>

                    <h2>No matching drafts</h2>

                    <p>
                        Try changing your search or filter.
                    </p>

                </div>

            ) : (

                <div className="draft-list">

                    {filteredDrafts.map((draft) => (

                        <div
                            className="draft-card"
                            key={draft.id}
                        >

                            <div className="draft-icon">
                                📝
                            </div>

                            <div className="draft-info">

                                <h3>
                                    {draft.data?.fullName ||
                                        "Untitled Form"}
                                </h3>

                                <p>
                                    {draft.data?.email ||
                                        "No email"}
                                </p>

                                <small>
                                    Updated:{" "}
                                    {draft.updatedAt
                                        ? new Date(draft.updatedAt).toLocaleString()
                                        : "Not available"}
                                </small>

                            </div>

                            <button
                                type="button"
                                className="draft-icon-button draft-edit-button"
                                aria-label="Edit draft"
                                title="Edit draft"
                                onClick={() => handleEdit(draft.id)}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>

                            <button
                                type="button"
                                className="draft-icon-button draft-delete-button"
                                onClick={() => handleDelete(draft.id)}
                                aria-label="Delete draft"
                                title="Delete draft"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}