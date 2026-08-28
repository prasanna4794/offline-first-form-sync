export function getNetworkStatus() {
    return navigator.onLine;
}

export function subscribeToNetworkStatus(
    onStatusChange
) {
    const handleOnline = () => {
        onStatusChange(true);
    };

    const handleOffline = () => {
        onStatusChange(false);
    };

    window.addEventListener(
        "online",
        handleOnline
    );

    window.addEventListener(
        "offline",
        handleOffline
    );

    return () => {
        window.removeEventListener(
            "online",
            handleOnline
        );

        window.removeEventListener(
            "offline",
            handleOffline
        );
    };
}