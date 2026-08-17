"use client";

import FormEditor from "@/components/forms/FormEditor";

export default function FormsPage() {
    return (
        <main className="form-page">

            <div className="form-page-header">

                <h1>Create Form</h1>

                <p>
                    Enter your information and save it as a draft.
                </p>

            </div>

            <FormEditor />

        </main>
    );
}