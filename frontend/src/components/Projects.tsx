import { useMemo } from "react";
import Project from "./Project"

interface tech {
    name: string,
    count: number
}

interface techs {
    data: tech[] | null,
}

export default function Projects({ projects }: any) {

    const alltechs: techs = useMemo(() => {
        if (!projects || projects.length === 0) {
            return { data: null };
        }

        const techs: techs = { data: null };

        for (let p of projects) {
            for (let t of p.technologies) {
                if (!techs.data) {
                    techs.data = [{ name: t, count: 1 }];
                } else {
                    const itemIndex = techs.data.findIndex((e) => e.name === t);
                    if (itemIndex === -1) {
                        techs.data = [...techs.data, { name: t, count: 1 }];
                    } else {
                        techs.data[itemIndex].count += 1;
                    }
                }
            }
        }

        return techs;
    }, [projects]);

    if (!projects || projects.length === 0) {
        projects = [{ id: 0, title: "Error", description: "ERROR: No projects.", technologies: [], date: 0 }];
    }

    console.log(alltechs.data);
    return (
        <>
            <section id="projects-section">
                {projects.map((project: any) =>
                    <Project key={project.id} id={project.id} title={project.title} description={project.description}
                        technologies={project.technologies} createdAt={project.createdAt} publishedAt={project.publishedAt}
                        isPublic={project.isPublic} status={project.status} tags={project.tags}>

                    </Project>
                )}
            </section>
            <ul>
                {alltechs.data?.map((t) =>
                    <li key={t.name}>{t.name}: {t.count}</li>)}
            </ul>
        </>
    )
}