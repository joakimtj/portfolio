import { Header } from "./Header"
import { Experiences } from "./Experiences"
import { Contact } from "./Contact"
import { Student } from "./types"
import Projects from "./Projects"
import { CreateProject } from "./CreateProject"
import { Project } from "./types"
import { useEffect, useState } from "react"
import { ofetch } from "ofetch"

function App() {

    const student: Student = {
        name: "Halgeir Geirson",
        degree: "Bachelor IT",
        points: 180,
        email: "student@hiof.no",
        experiences: [
            "Figma UI for customer X",
            "Website for customer Y"
        ]
    }

    // This is not used.
    // Projects are loaded from the server.
    const initialProjects: Project[] = [
        {
            id: 0,
            title: "Portfolio Website", description: "A personal portfolio website showcasing projects and skills.",
            technologies: ["HTML", "CSS", "JavaScript"], date: 2024
        },
        {
            id: 1,
            title: "Weather Dashboard", description: "A weather dashboard that shows real-time weather updates for various cities.",
            technologies: ["Vue.js", "API Integration", "TailwindCSS"], date: 2023
        },
        {
            id: 2,
            title: "Blog Platform", description: "A simple blogging platform where users can write and publish articles.",
            technologies: ["Django", "SQLite", "Bootstrap"], date: 2024
        },
        {
            id: 3,
            title: "E-commerce Platform",
            description: "A full-featured e-commerce website with product listings, shopping cart, and checkout process.",
            technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
            date: 2023
        },
        {
            id: 4,
            title: "Task Management App",
            description: "A collaborative task management application with real-time updates and team features.",
            technologies: ["Angular", "Firebase", "RxJS", "Material UI"],
            date: 2024
        },
        {
            id: 5,
            title: "AI-Powered Image Recog. App",
            description: "A mobile application that uses machine learning to identify objects in photos taken by users.",
            technologies: ["Flutter", "TensorFlow Lite", "Dart"],
            date: 2024
        }
    ]

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        projects.length > 0 ? projects[0].id : null
    );

    const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectSelect = (id: number) => {
        setSelectedProjectId(id);
        console.log("Selected id: ", id);
    }

    const handleProjectCreate = async (project: Project) => {
        try {
            const response = await fetch('http://localhost:3000/add', {
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

    const onProjectDelete = async (id: number) => {
        try {
            console.log("Attempting to delete project with id:", id);
            const response = await fetch(`http://localhost:3000/delete/${id}`, {
                method: 'DELETE',
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete project');
            }

            const result = await response.json();
            console.log("Delete result:", result);

            // Update local state if deletion was successful
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
            <h2>Student</h2>
            <section id="student-section">
                <section id="student-details-section">
                    <Header student={student.name} degree={student.degree} points={student.points} />
                    <Experiences experiences={student.experiences} />
                </section>
                <Contact email={student.email} />
            </section>
            <h2>Projects</h2>
            <section id="projects-edit-container">

                <CreateProject projects={projects} selectedProjectId={selectedProjectId}
                    onProjectSelect={handleProjectSelect} onProjectCreate={handleProjectCreate} onProjectDelete={onProjectDelete}></CreateProject>
                <div id="divider"></div>
                <Projects projects={projects} />
            </section>

        </>
    )
}

export default App;
