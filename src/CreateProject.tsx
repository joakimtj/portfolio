import { FormEvent, useState } from "react";
import { Project } from "./types";

export const CreateProject: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [technologies, setTechnologies] = useState<string>("");
    const [date, setDate] = useState<number>();

    const [selectedId, setSelectedId] = useState<number>();

    const handleDeleteForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        projects = projects.filter(project => project.id !== selectedId);
        console.log(projects);
    }

    return (
        <div>
            <form className="create-project-form">
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
                    rows={6}
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
                    onChange={(e) => { setDate(parseInt(e.target.value, 10)) }}
                ></input>
                <button type="submit">Submit</button>
            </form>

            <form onSubmit={handleDeleteForm}>
                <label htmlFor="id">Project id: </label>
                <select name="id" value={selectedId} onChange={(e) => setSelectedId(parseInt(e.target.value, 10))}>
                    {projects.map((project) =>
                        <option key={project.id}
                            value={project.id}
                        >
                            {project.title}
                        </option>
                    )}
                </select>
                <button type="submit">Delete</button>
            </form>
        </div >
    )
}