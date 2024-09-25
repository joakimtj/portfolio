import { Header } from "./Header"
import { Experiences } from "./Experiences"
import { Contact } from "./Contact"
import { Student } from "./types"
import Projects from "./Projects"
import { CreateProject } from "./CreateProject"
import { Project } from "./types"

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

    const projects: Project[] = [
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
            "id": 4,
            "title": "E-commerce Platform",
            "description": "A full-featured e-commerce website with product listings, shopping cart, and checkout process.",
            "technologies": ["React", "Node.js", "MongoDB", "Stripe API"],
            "date": 2023
        },
        {
            "id": 5,
            "title": "Task Management App",
            "description": "A collaborative task management application with real-time updates and team features.",
            "technologies": ["Angular", "Firebase", "RxJS", "Material UI"],
            "date": 2024
        },
        {
            "id": 6,
            "title": "AI-Powered Image Recog. App",
            "description": "A mobile application that uses machine learning to identify objects in photos taken by users.",
            "technologies": ["Flutter", "TensorFlow Lite", "Google Cloud Vision API", "Dart"],
            "date": 2024
        }

    ]

    return (
        <>
            <section id="student-section">
                <section id="student-details-section">
                    <Header student={student.name} degree={student.degree} points={student.points} />
                    <Experiences experiences={student.experiences} />
                </section>
                <Contact email={student.email} />
            </section>

            <CreateProject projects={projects}></CreateProject>
            <Projects projects={projects} />
        </>
    )
}

export default App;
