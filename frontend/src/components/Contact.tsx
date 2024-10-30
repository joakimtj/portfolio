import React, { useState } from "react";
import { ContactForm } from "./ContactForm";
import { Mail } from "lucide-react";

type ContactProps = {
    email: string;
};

export const Contact: React.FC<ContactProps> = ({ email }) => {
    const [submittedData, setSubmittedData] = useState<{ name: string; content: string } | null>(null);

    const handleFormSubmit = (name: string, content: string) => {
        setSubmittedData({ name, content });
    };

    return (
        <section id="contact-section" className="mx-auto bg-gray-100 px-56 py-12">
            <div className="mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-gray-600">Use the below form.</p>
                    </div>

                    {/* Contact Button */}
                    <div className="mb-8 flex justify-center">
                        <button
                            id="show-contact-button"
                            type="button"
                            onClick={() => alert(email)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full 
                                     hover:bg-blue-700 transition-colors duration-300 font-medium shadow-sm"
                        >
                            <Mail className="w-5 h-5" />
                            Show Contact Email
                        </button>
                    </div>

                    {/* Form Container */}
                    <div
                        id="form-show-submit-container"
                        className="space-y-8"
                    >
                        {/* Contact Form */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <ContactForm onSubmit={handleFormSubmit} />
                        </div>

                        {/* Submitted Data Display */}
                        {submittedData && (
                            <div
                                id="show-submitted-data"
                                className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-6"
                            >
                                <h3 className="text-lg font-semibold text-blue-900 mb-4">Submitted Data</h3>
                                <pre className="bg-white p-4 rounded-md overflow-x-auto text-sm text-gray-700">
                                    {JSON.stringify(submittedData, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};