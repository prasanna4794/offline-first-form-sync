import "./globals.css";

import SyncManager from "@/components/sync/SyncManager";

export const metadata = {
    title: "Offline-first-form-sync",
    description: "Form synchronization dashboard",
};

export default function RootLayout({ children }) {

    return (

        <html lang="en">

            <body>

                <SyncManager />

                {children}

            </body>

        </html>

    );

}