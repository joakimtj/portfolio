import { FormEvent, useState } from "react";
import { Project } from "../types";
import { z } from 'zod';

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
        <section id="create-delete-projects-section">
            <form onSubmit={handleSubmitCreate} className="create-project-form">
                <h2>Add a new project</h2>

                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
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
                {validationErrors.title && <p className="error">{validationErrors.title}</p>}

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    cols={20}
                    rows={3}
                />
                {validationErrors.description && <p className="error">{validationErrors.description}</p>}

                <label htmlFor="technologies">Technologies</label>
                <input
                    type="text"
                    id="technologies"
                    name="technologies"
                    placeholder="React, Typescript ..."
                    pattern="[a-zA-Z0-9.-_ ,]+"
                    value={technologies}
                    onChange={(e) => { setTechnologies(e.target.value) }}
                />
                {validationErrors.technologies && <p className="error">{validationErrors.technologies}</p>}

                <label htmlFor="date">Date</label>
                <input
                    type="text"
                    id="date"
                    name="date"
                    placeholder="1984"
                    pattern="[0-9]{0,4}"
                    value={createdAt}
                    onChange={(e) => { setCreatedAt(e.target.value) }}
                />
                {validationErrors.createdAt && <p className="error">{validationErrors.createdAt}</p>}

                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={hasStatus}
                    onChange={(e) => { setHasStatus(e.target.value) }}
                >
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                    <option value="archived">Archived</option>
                </select>
                {validationErrors.hasStatus && <p className="error">{validationErrors.hasStatus}</p>}

                <label htmlFor="isPublic">Visibility</label>
                <div className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={isPublic}
                        onChange={(e) => { setIsPublic(e.target.checked) }}
                    />
                    <span>Make this project public</span>
                </div>
                {validationErrors.isPublic && <p className="error">{validationErrors.isPublic}</p>}

                <label htmlFor="tags">Tags</label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="frontend, backend, mobile ..."
                    pattern="[a-zA-Z0-9.-_ ,]+"
                    value={tags}
                    onChange={(e) => { setTags(e.target.value) }}
                />
                {validationErrors.tags && <p className="error">{validationErrors.tags}</p>}

                <label htmlFor="publishedAt">Publish Date</label>
                <input
                    type="date"
                    id="publishedAt"
                    name="publishedAt"
                    value={publishedAt}
                    onChange={(e) => { setPublishedAt(e.target.value) }}
                />
                {validationErrors.publishedAt && <p className="error">{validationErrors.publishedAt}</p>}

                {validationErrors.form && <p className="error">{validationErrors.form}</p>}
                <button type="submit">Submit</button>
            </form>

            <form onSubmit={handleSubmitDelete} id="delete-projects-form">
                <h2>Delete existing project</h2>
                <label htmlFor="id">Select: </label>
                <select name="id" value={selectedProjectId || ''} onChange={(e) => onProjectSelect(Number(e.target.value))}>
                    {projects.map((project) => {
                        return (
                            <option key={project.id}
                                value={project.id}
                            >
                                {project.title}
                            </option>
                        )
                    })}
                </select>
                <button type="submit">Delete</button>
            </form>
        </section>
    )
}