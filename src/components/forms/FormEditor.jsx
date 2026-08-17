"use client";

import { useState } from "react";
import { saveForm } from "@/lib/db/indexedDB";

export default function FormEditor() {

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

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const dataToSave = {
                id: "form-001",
                ...formData
            };

            await saveForm(dataToSave);

            console.log(
                "Form saved successfully:",
                dataToSave
            );

        } catch (error) {

            console.error(
                "Failed to save form:",
                error
            );

        }
    };

    return (
        <form
            className="form-editor"
            onSubmit={handleSubmit}
        >

            {/* Personal Information */}

            <div className="form-section">

                <h2>Personal Information</h2>

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
                            onChange={handleChange}
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


            {/* Address */}

            <div className="form-section">

                <h2>Address Information</h2>

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

                <h2>Additional Information</h2>

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


            {/* Submit */}

            <div className="form-actions">

                <button
                    type="button"
                    className="secondary-button"
                >
                    Save Draft
                </button>

                <button
                    type="submit"
                    className="primary-button"
                >
                    Save Form
                </button>

            </div>

        </form>
    );
}