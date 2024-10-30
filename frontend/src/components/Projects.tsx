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

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Projects</h1>

                    {/* Technology Statistics */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Technology Usage</h2>
                        {alltechs.data ? (
                            <ul className="flex flex-wrap gap-4">
                                {alltechs.data.map((t) => (
                                    <li
                                        key={t.name}
                                        className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2"
                                    >
                                        <span className="font-medium text-gray-700">{t.name}</span>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                            {t.count}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No technology data available</p>
                        )}
                    </div>
                </div>

                {/* Horizontal Projects Section */}
                <section
                    id="projects-section"
                    className="flex flex-nowrap gap-6 overflow-x-auto pb-6 snap-x snap-mandatory"
                >
                    {projects.map((project: any, index: number) => (
                        <div
                            key={project.id}
                            className="w-full min-w-[350px] max-w-[400px] flex-none snap-center first:ml-0"
                        >
                            <Project
                                id={project.id}
                                title={project.title}
                                description={project.description}
                                technologies={project.technologies}
                                createdAt={project.createdAt}
                                publishedAt={project.publishedAt}
                                isPublic={project.isPublic}
                                hasStatus={project.hasStatus}
                                tags={project.tags}
                            />
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}