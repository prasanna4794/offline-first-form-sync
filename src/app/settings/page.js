"use client";

import {

    useEffect,
    useState

} from "react";


export default function SettingsPage() {

    const [

        autoSync,

        setAutoSync

    ] = useState(true);


    const [

        syncInterval,

        setSyncInterval

    ] = useState("30");


    const [

        notifications,

        setNotifications

    ] = useState(true);


    const [

        saveMessage,

        setSaveMessage

    ] = useState("");


    useEffect(() => {

        const savedSettings =
            localStorage.getItem(
                "sync-settings"
            );


        if (savedSettings) {

            const parsed =
                JSON.parse(
                    savedSettings
                );


            setAutoSync(
                parsed.autoSync ?? true
            );


            setSyncInterval(
                parsed.syncInterval ?? "30"
            );


            setNotifications(
                parsed.notifications ?? true
            );

        }

    }, []);


    const handleSave =
        () => {

            localStorage.setItem(

                "sync-settings",

                JSON.stringify({

                    autoSync,

                    syncInterval,

                    notifications

                })

            );


            setSaveMessage(
                "Settings saved successfully."
            );


            setTimeout(() => {

                setSaveMessage("");

            }, 3000);

        };


    return (

        <main className="settings-page">


            {/* Header */}

            <div className="settings-header">

                <h1>
                    Settings
                </h1>

                <p>
                    Configure your synchronization preferences.
                </p>

            </div>


            {/* Sync Settings */}

            <section className="settings-section">

                <h2>
                    Synchronization
                </h2>


                <div className="settings-row">

                    <div>

                        <h3>
                            Automatic Sync
                        </h3>

                        <p>
                            Automatically sync pending forms when online.
                        </p>

                    </div>


                    <label className="settings-switch">

                        <input

                            type="checkbox"

                            checked={autoSync}

                            onChange={(event) =>
                                setAutoSync(
                                    event.target.checked
                                )
                            }

                        />

                        <span className="settings-slider" />

                    </label>

                </div>


                <div className="settings-row">

                    <div>

                        <h3>
                            Sync Interval
                        </h3>

                        <p>
                            Choose how often the application checks for pending sync items.
                        </p>

                    </div>


                    <select

                        value={syncInterval}

                        onChange={(event) =>
                            setSyncInterval(
                                event.target.value
                            )
                        }

                    >

                        <option value="10">
                            Every 10 seconds
                        </option>

                        <option value="30">
                            Every 30 seconds
                        </option>

                        <option value="60">
                            Every 1 minute
                        </option>

                    </select>

                </div>

            </section>


            {/* Notifications */}

            <section className="settings-section">

                <h2>
                    Notifications
                </h2>


                <div className="settings-row">

                    <div>

                        <h3>
                            Sync Notifications
                        </h3>

                        <p>
                            Show notifications when synchronization is completed or fails.
                        </p>

                    </div>


                    <label className="settings-switch">

                        <input

                            type="checkbox"

                            checked={notifications}

                            onChange={(event) =>
                                setNotifications(
                                    event.target.checked
                                )
                            }

                        />

                        <span className="settings-slider" />

                    </label>

                </div>

            </section>


            {/* Save */}

            <div className="settings-footer">

                {

                    saveMessage

                    && (

                        <span>

                            {saveMessage}

                        </span>

                    )

                }


                <button
                    onClick={handleSave}
                >

                    Save Settings

                </button>

            </div>

        </main>

    );

}