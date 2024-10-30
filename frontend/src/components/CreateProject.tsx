import { useState } from "react";
import { Project } from "../types";
import { z } from 'zod';
import { Trash2 } from "lucide-react";

// Zod schema for project validation
const ProjectSchema = z.object({
    id: z.number(),
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters")
        .regex(/^[a-zA-Z- ]+$/, "Title must contain only letters"),
    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description must be less than 1000 characters"),
    technologies: z.array(z.string())
        .min(1, "At least one technology is required")
        .max(20, "Maximum 20 technologies allowed"),
    createdAt: z.number()
        .int()
        .min(1900, "Year must be after 1900")
        .max(new Date().getFullYear(), "Year cannot be in the future"),
    publishedAt: z.number()
        .int(),
    isPublic: z.boolean(),
    hasStatus: z.enum(["in_progress", "completed", "planned", "archived"]),
    tags: z.array(z.string())
        .max(10, "Maximum 10 tags allowed")
});

type CreateProjectProps = {
    projects: Project[],
    selectedProjectId: number | null;
    onProjectSelect: (id: number) => void,
    onProjectCreate: (project: Project) => void,
    onProjectDelete: (id: number) => void,
}

export const CreateProject: React.FC<CreateProjectProps> = ({ projects, selectedProjectId,
    onProjectSelect, onProjectCreate, onProjectDelete }) => {

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [technologies, setTechnologies] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<string>("");
    const [hasStatus, setHasStatus] = useState<string>('in_progress');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [tags, setTags] = useState<string>('');
    const [publishedAt, setPublishedAt] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const findNextAvailableId = (projects: Project[]): number => {
        if (projects.length === 0) return 1;
        const maxId = Math.max(...projects.map(p => p.id));
        return maxId + 1;
    };

    const validateTitle = (title: string) => {
        const result = z.string()
            .regex(/^[a-zA-Z- ]+$/, "Title must contain only letters")
            .safeParse(title);
        return result.success;
    }

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        const id = findNextAvailableId(projects);

        try {
            const projectData = {
                id,
                title,
                description,
                technologies: technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
                createdAt: Number(createdAt),
                publishedAt: new Date(publishedAt).getTime(),
                isPublic,
                hasStatus,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            };

            const validationResult = ProjectSchema.safeParse(projectData);

            if (!validationResult.success) {
                const errors: Record<string, string> = {};
                validationResult.error.errors.forEach((error) => {
                    const field = error.path.join('.');
                    errors[field] = error.message;
                });
                setValidationErrors(errors);
                return;
            }

            onProjectCreate(projectData);

            setTitle("");
            setDescription("");
            setTechnologies("");
            setCreatedAt("");
            setTags("");
            setPublishedAt("");
            setIsPublic(false);
            setHasStatus("in_progress");
            setValidationErrors({});

        } catch (error) {
            console.error('Validation error:', error);
            setValidationErrors({ form: 'Invalid form data' });
        }
    }

    const handleSubmitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProjectId !== null) {
            onProjectDelete(selectedProjectId);
        }
    };

    return (
        <section id="create-delete-projects-section" className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Create Project Form */}
            <form onSubmit={handleSubmitCreate} className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add a New Project</h2>

                {/* Title Input */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onBlur={() => {
                            const isValid = validateTitle(title);
                            if (!isValid && title.length > 0) {
                                setValidationErrors(prev => ({
                                    ...prev,
                                    title: "Title must contain only letters"
                                }));
                            } else {
                                setValidationErrors(prev => {
                                    const { title, ...rest } = prev;
                                    return rest;
                                });
                            }
                        }}
                        onChange={(e) => { setTitle(e.target.value) }}
                    />
                    {validationErrors.title && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.title}</p>
                    )}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validationErrors.description && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.description}</p>
                    )}
                </div>

                {/* Technologies Input */}
                <div className="space-y-2">
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
                        Technologies
                    </label>
                    <input
                        type="text"
                        id="technologies"
                        name="technologies"
                        placeholder="React, TypeScript ..."
                        pattern="[a-zA-Z0-9.-_ ,]+"
                        value={technologies}
                        onChange={(e) => { setTechnologies(e.target.value) }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validationErrors.technologies && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.technologies}</p>
                    )}
                </div>

                {/* Date and Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            placeholder="1984"
                            pattern="[0-9]{0,4}"
                            value={createdAt}
                            onChange={(e) => { setCreatedAt(e.target.value) }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {validationErrors.createdAt && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.createdAt}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={hasStatus}
                            onChange={(e) => { setHasStatus(e.target.value) }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="planned">Planned</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Visibility Checkbox */}
                <div className="space-y-2">
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={isPublic}
                            onChange={(e) => { setIsPublic(e.target.checked) }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Make this project public</span>
                    </label>
                </div>

                {/* Tags and Publish Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            placeholder="frontend, backend, mobile ..."
                            pattern="[a-zA-Z0-9.-_ ,]+"
                            value={tags}
                            onChange={(e) => { setTags(e.target.value) }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
                            Publish Date
                        </label>
                        <input
                            type="date"
                            id="publishedAt"
                            name="publishedAt"
                            value={publishedAt}
                            onChange={(e) => { setPublishedAt(e.target.value) }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {validationErrors.form && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.form}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 
                             transition-colors duration-300 font-medium"
                >
                    Create Project
                </button>
            </form>

            {/* Delete Project Form */}
            <form
                onSubmit={handleSubmitDelete}
                id="delete-projects-form"
                className="border-t border-gray-200 pt-8"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Delete Project</h2>

                <div className="flex items-end gap-4">
                    <div className="flex-grow space-y-2">
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                            Select Project
                        </label>
                        <select
                            name="id"
                            value={selectedProjectId || ''}
                            onChange={(e) => onProjectSelect(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                                 transition-colors duration-300 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </form>
        </section>
    )
}