import { FormEvent, useState } from "react";
import { Project } from "./types";

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
    const [date, setDate] = useState<string>("");

    const [validTitle, setValidTitle] = useState<boolean>(false);
    const [validDescription, setValidDescription] = useState<boolean>(false);
    const [validTechnologies, setValidTechnologies] = useState<boolean>(false);
    const [validDate, setValidDate] = useState<boolean>(false);

    const findNextAvailableId = (projects: Project[]): number => {
        if (projects.length === 0) return 1; // If no projects, start with ID 1

        const maxId = Math.max(...projects.map(p => p.id));
        return maxId + 1;
    };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();

        const nextId = findNextAvailableId(projects);

        const project: Project = {
            id: nextId,
            title: title,
            description: description,
            technologies: technologies
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech !== ''),
            date: Number(date)
        }

        onProjectCreate(project);
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
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                ></input>
                <label htmlFor="description">Description: </label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    cols={25}
                    rows={3}
                ></textarea>
                <label htmlFor="technologies">Technologies:</label>
                <input
                    type="text"
                    id="technologies"
                    name="technologies"
                    value={technologies}
                    onChange={(e) => { setTechnologies(e.target.value) }}
                ></input>
                <label htmlFor="date">Date:</label>
                <input
                    type="text"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value) }}
                ></input>
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