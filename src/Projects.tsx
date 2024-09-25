import Project from "./Project"

export default function Projects({ projects }: any) {
    if (!projects || projects.length === 0) {
        projects = [{ id: 0, title: "Error", description: "ERROR: No projects.", technologies: [], date: 0 }]
    }

    return (
        <section id="projects-section">
            {projects.map((project: any) =>
                <Project key={project.id} id={project.id} title={project.title} description={project.description}
                    technologies={project.technologies} date={project.date}>

                </Project>
            )}
        </section>
    )
}