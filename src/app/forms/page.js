"use client";

import { Suspense } from "react";
import FormEditor from "@/components/forms/FormEditor";

function FormEditorFallback() {
    return (
        <main className="form-page">
            <p>Loading form...</p>
        </main>
    );
}

export default function FormsPage() {
    return (
        <main className="form-page">
            <Suspense fallback={<FormEditorFallback />}>
                <FormEditor />
            </Suspense>
        </main>
    );
}
