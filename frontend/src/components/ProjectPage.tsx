import React, { useState } from 'react';
import { CreateProject } from './CreateProject';
import Projects from './Projects';
import { Project } from '../types';
import { useFetchProjects } from '../hooks/useFetchProjects';
import { endpoints } from '../config/urls';

export const ProjectPage = () => {
    const { projects, setProjects, isLoading, error } = useFetchProjects();
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        projects.length > 0 ? projects[0].id : null
    );

    const handleProjectSelect = (id: number) => {
        setSelectedProjectId(id);
        console.log("Selected id: ", id);
    };

    const handleProjectCreate = async (project: Project) => {
        try {
            const response = await fetch(endpoints.addProject, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            const createdProject = await response.json();
            setProjects(prevProjects => [...prevProjects, createdProject]);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleProjectDelete = async (id: number) => {
        try {
            console.log("Attempting to delete project with id:", id);
            const response = await fetch(`${endpoints.deleteProject}/${id}`, {
                method: 'DELETE',
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete project');
            }

            const result = await response.json();
            console.log("Delete result:", result);

            setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
            setSelectedProjectId(prev => prev === id ? null : prev);
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h2>Projects</h2>
            <section id="projects-edit-container">
                <CreateProject
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    onProjectSelect={handleProjectSelect}
                    onProjectCreate={handleProjectCreate}
                    onProjectDelete={handleProjectDelete}
                />
                <div id="divider"></div>
                <Projects projects={projects} />
            </section>
        </>
    );
};