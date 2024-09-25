import { Header } from "./Header"
import { Experiences } from "./Experiences"
import { Contact } from "./Contact"
import { Student } from "./types"
import Projects from "./Projects"
import { CreateProject } from "./CreateProject"
import { Project } from "./types"
import { useState } from "react"

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

    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        projects.length > 0 ? projects[0].id : null
    );

    const handleProjectSelect = (id: number) => {
        setSelectedProjectId(id);
        console.log("Selected id: ", id);
    }

    const handleProjectCreate = (project: Project) => {
        setProjects(prevProjects => [...prevProjects, project]);
    }

    const onProjectDelete = (id: number) => {
        console.log(selectedProjectId);
        setProjects(prevProjects => {
            const newProjects = prevProjects.filter(project => project.id !== id);
            // Update currentProjectId within the same state update
            setSelectedProjectId(newProjects.length > 0 ? newProjects[0].id : null);
            return newProjects;
        });
    }

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
                <Projects projects={projects} />
            </section>

        </>
    )
}

export default App;
