import "./globals.css";

export const metadata = {
    title: "Dev Microverse",
    description: "Form synchronization dashboard",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}