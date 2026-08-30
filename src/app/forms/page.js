"use client";

import { Suspense } from "react";
import FormEditor from "@/components/forms/FormEditor";

export default function FormsPage() {
    return (
        <main className="form-page">
            <Suspense fallback={<div>Loading form...</div>}>
                <FormEditor />
            </Suspense>
        </main>
    );
}
