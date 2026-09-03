import "./globals.css";

import SyncManager from "@/components/sync/SyncManager";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata = {
    title: "Offline-first-form-sync",
    description: "Form synchronization dashboard",
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {

    return (

        <html lang="en">

            <body>

                <ServiceWorkerRegistration />

                <SyncManager />

                {children}

            </body>

        </html>

    );

}