import React, { useState, type FormEvent } from "react";

type ContactFormProps = {
    onSubmit: (name: string, content: string) => void;
};

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(name, content);
        setName("");
        setContent("");
    };

    return (
        <form id="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name: </label>
            <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="content">Content: </label>
            <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                cols={25}
                rows={6}
            ></textarea>
            <button type="submit">Send</button>
        </form>
    );
};