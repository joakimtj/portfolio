import React, { useState } from "react";
import { ContactForm } from "./ContactForm";

type ContactProps = {
    email: string;
};

export const Contact: React.FC<ContactProps> = ({ email }) => {
    const [submittedData, setSubmittedData] = useState<{ name: string; content: string } | null>(null);

    const handleFormSubmit = (name: string, content: string) => {
        setSubmittedData({ name, content });
    };

    return (
        <section id="contact-section">

            <button id="show-contact-button" type="button" onClick={() => alert(email)}>
                Show Contact
            </button>
            <div id="form-show-submit-container">
                <ContactForm onSubmit={handleFormSubmit} />

                {submittedData && (
                    <div id="show-submitted-data">
                        <h3>Data</h3>
                        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                    </div>
                )}
            </div>



        </section>
    );
};