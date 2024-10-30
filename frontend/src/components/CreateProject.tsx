import { FormEvent, useState } from "react";
import { Project } from "../types";

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

    const [validTitle, setValidTitle] = useState<boolean>(false);

    const findNextAvailableId = (projects: Project[]): number => {
        if (projects.length === 0) return 1; // If no projects, start with ID 1

        const maxId = Math.max(...projects.map(p => p.id));
        return maxId + 1;
    };

    const validateTitle = (title: string) => {
        title.match(/^[a-zA-Z]+$/) ? setValidTitle(true) : setValidTitle(false);
    }

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();

        const id = findNextAvailableId(projects);

        const projectData = {
            id,
            title,
            description,
            technologies: technologies.split(',').map(tech => tech.trim()),
            createdAt: Number(createdAt),
            publishedAt: new Date(publishedAt).getTime(),
            isPublic,
            hasStatus,
            tags: tags.split(',').map(tag => tag.trim())
        };

        onProjectCreate(projectData);

        setTitle("");
        setDescription("");
        setTechnologies("");
        setCreatedAt("");
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
                        validateTitle(title);
                    }}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                {!validTitle && title.length > 0 ? (<p>Error</p>) : null}

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    cols={20}
                    rows={3}
                />

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

                <label htmlFor="publishedAt">Publish Date</label>
                <input
                    type="date"
                    id="publishedAt"
                    name="publishedAt"
                    value={publishedAt}
                    onChange={(e) => { setPublishedAt(e.target.value) }}
                />

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
        </section >
    )
}