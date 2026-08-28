"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
    saveForm,
    getForm
} from "@/lib/db/indexedDB";

import { generateFormId } from "@/lib/utils/formId";

import {
    addToSyncQueue
} from "@/lib/sync/syncQueue";

export default function FormEditor() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const draftId = searchParams.get("draftId");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        occupation: "",

        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",

        website: "",
        experience: "",
        skills: "",
        priority: "",
        description: "",

        terms: false
    });

    const isInitialLoad = useRef(true);

    const [formId] = useState(() =>
        generateFormId()
    );

    const [saveStatus, setSaveStatus] =
        useState("Saved");

    const [createdAt, setCreatedAt] =
        useState(null);

    const activeFormId =
        draftId || formId;


    /*
    |--------------------------------------------------------------------------
    | Handle Input Changes
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setSaveStatus("Saving...");

        setFormData((previousData) => ({
            ...previousData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | Convert Form Priority To Sync Queue Priority
    |--------------------------------------------------------------------------
    */

    const getSyncPriority = () => {

        const priority =
            formData.priority?.toLowerCase();

        if (priority === "critical") {
            return "HIGH";
        }

        if (priority === "high") {
            return "HIGH";
        }

        if (priority === "medium") {
            return "MEDIUM";
        }

        return "LOW";
    };


    /*
    |--------------------------------------------------------------------------
    | Save Form + Add Sync Queue Transaction
    |--------------------------------------------------------------------------
    */

    const saveFormAndQueue = async () => {

        const now =
            new Date().toISOString();

        const finalCreatedAt =
            createdAt || now;


        const dataToSave = {

            id: activeFormId,

            status:
                navigator.onLine
                    ? "PENDING"
                    : "PENDING",

            createdAt: finalCreatedAt,

            updatedAt: now,

            data: formData

        };


        await saveForm(
            dataToSave
        );


        await addToSyncQueue({

            id:
                `sync-${activeFormId}`,

            formId:
                activeFormId,

            operation:
                draftId
                    ? "UPDATE"
                    : "CREATE",

            payload:
                dataToSave,

            priority:
                getSyncPriority()

        });


        if (!createdAt) {

            setCreatedAt(
                finalCreatedAt
            );

        }


        return dataToSave;

    };


    /*
    |--------------------------------------------------------------------------
    | Submit Form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await saveFormAndQueue();

            setSaveStatus("Saved");

            console.log(
                "Form saved and added to sync queue."
            );

        } catch (error) {

            console.error(
                "Failed to save form:",
                error
            );

            setSaveStatus("Save failed");
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Manual Save Draft
    |--------------------------------------------------------------------------
    */

    const handleSaveDraft = async () => {

        try {

            setSaveStatus("Saving...");

            await saveFormAndQueue();

            setSaveStatus("Saved");

            console.log(
                "Draft saved locally and queued for sync."
            );

        } catch (error) {

            console.error(
                "Failed to save draft:",
                error
            );

            setSaveStatus("Save failed");
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load Existing Draft
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadSavedForm = async () => {

            try {

                const savedForm =
                    await getForm(activeFormId);

                if (savedForm) {

                    setCreatedAt(
                        savedForm.createdAt
                    );

                    setFormData({

                        fullName:
                            savedForm.data?.fullName ||
                            "",

                        email:
                            savedForm.data?.email ||
                            "",

                        phone:
                            savedForm.data?.phone ||
                            "",

                        dateOfBirth:
                            savedForm.data?.dateOfBirth ||
                            "",

                        gender:
                            savedForm.data?.gender ||
                            "",

                        occupation:
                            savedForm.data?.occupation ||
                            "",


                        address:
                            savedForm.data?.address ||
                            "",

                        city:
                            savedForm.data?.city ||
                            "",

                        state:
                            savedForm.data?.state ||
                            "",

                        country:
                            savedForm.data?.country ||
                            "",

                        pincode:
                            savedForm.data?.pincode ||
                            "",


                        website:
                            savedForm.data?.website ||
                            "",

                        experience:
                            savedForm.data?.experience ||
                            "",

                        skills:
                            savedForm.data?.skills ||
                            "",

                        priority:
                            savedForm.data?.priority ||
                            "",

                        description:
                            savedForm.data?.description ||
                            "",


                        terms:
                            savedForm.data?.terms ||
                            false
                    });
                }

            } catch (error) {

                console.error(
                    "Failed to load saved form:",
                    error
                );

            } finally {

                isInitialLoad.current = false;
            }
        };


        loadSavedForm();

    }, [activeFormId]);


    useEffect(() => {

        if (isInitialLoad.current) {
            return;
        }


        const timer = setTimeout(async () => {

            try {

                const now =
                    new Date().toISOString();

                const finalCreatedAt =
                    createdAt || now;

                const dataToSave = {

                    id: activeFormId,

                    status: "draft",

                    createdAt:
                        finalCreatedAt,

                    updatedAt: now,

                    data: formData
                };


                await saveForm(dataToSave);


                if (!createdAt) {

                    setCreatedAt(
                        finalCreatedAt
                    );
                }

                setSaveStatus("Saved");

            } catch (error) {

                console.error(
                    "Auto-save failed:",
                    error
                );

                setSaveStatus(
                    "Save failed"
                );
            }

        }, 500);


        return () => {

            clearTimeout(timer);

        };

    }, [formData]);

    const handleBackToDashboard = () => {

        router.push("/");

    };


    return (

        <main className="form-page">

            <div className="form-page-header">
                     <div>
                    <h1>
                        {draftId
                            ? "Edit Draft"
                            : "Create New Form"}
                    </h1>

                    <p>
                        Fill in the form details.
                        Your changes are saved locally
                        and prepared for synchronization.
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


            <form
                className="form-editor"
                onSubmit={handleSubmit}
            >

                <div className="save-status">

                    {saveStatus === "Saving..." &&
                        "⏳ Saving..."}

                    {saveStatus === "Saved" &&
                        "✓ Saved locally"}

                    {saveStatus === "Save failed" &&
                        "⚠ Save failed"}

                </div>

                <div className="form-section">

                    <h2>
                        Personal Information
                    </h2>

                    <div className="form-grid">

                        <div className="form-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="dateOfBirth">
                                Date of Birth
                            </label>

                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                max={
                                    new Date(
                                        new Date().setFullYear(
                                            new Date().getFullYear() - 18
                                        )
                                    )
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={handleChange}
                                onClick={(event) => {

                                    if (
                                        event.target.showPicker
                                    ) {
                                        event.target.showPicker();
                                    }

                                }}
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="gender">
                                Gender
                            </label>

                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label htmlFor="occupation">
                                Occupation
                            </label>

                            <input
                                id="occupation"
                                name="occupation"
                                type="text"
                                value={formData.occupation}
                                onChange={handleChange}
                                placeholder="Enter your occupation"
                            />

                        </div>

                    </div>

                </div>

                <div className="form-section">

                    <h2>
                        Address Information
                    </h2>

                    <div className="form-grid">

                        <div className="form-group full-width">

                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your complete address"
                                rows="3"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="state">
                                State
                            </label>

                            <input
                                id="state"
                                name="state"
                                type="text"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="country">
                                Country
                            </label>

                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Enter country"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="pincode">
                                Pincode
                            </label>

                            <input
                                id="pincode"
                                name="pincode"
                                type="text"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter pincode"
                            />

                        </div>

                    </div>

                </div>


                {/* Additional Information */}

                <div className="form-section">

                    <h2>
                        Additional Information
                    </h2>

                    <div className="form-grid">

                        <div className="form-group">

                            <label htmlFor="website">
                                Website
                            </label>

                            <input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="experience">
                                Experience
                            </label>

                            <input
                                id="experience"
                                name="experience"
                                type="number"
                                min="0"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Years of experience"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="skills">
                                Skills
                            </label>

                            <input
                                id="skills"
                                name="skills"
                                type="text"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Next.js"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="priority">
                                Priority
                            </label>

                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select priority
                                </option>

                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>

                                <option value="critical">
                                    Critical
                                </option>

                            </select>

                        </div>


                        <div className="form-group full-width">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter additional information..."
                                rows="5"
                            />

                        </div>

                    </div>

                </div>


                {/* Terms */}

                <div className="terms-group">

                    <label>

                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                        />

                        <span>
                            I agree to the terms and conditions.
                        </span>

                    </label>

                </div>


                {/* Actions */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>


                    {/* <button
                        type="submit"
                        className="primary-button"
                    >
                        Save Form
                    </button> */}

                </div>

            </form>

        </main>
    );
}