import React, { useState } from "react";

type ContactFormProps = {
    onSubmit: (name: string, content: string) => void;
};

export const ContactForm = ({ onSubmit }: { onSubmit: (name: string, content: string) => void }) => {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, content);
        setName("");
        setContent("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             shadow-sm"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             shadow-sm"
                    rows={4}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md 
                         hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
                Send Message
            </button>
        </form>
    );
};