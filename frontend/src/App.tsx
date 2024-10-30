import { Header } from "./Header"
import { Experiences } from "./Experiences"
import { Contact } from "./Contact"
import { Student } from "./types"
import { ProjectPage } from "./ProjectPage"
import Layout from "./Layout"

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

    return (
        <Layout>
            <h2>Student</h2>
            <section id="student-section">
                <section id="student-details-section">
                    <Header student={student.name} degree={student.degree} points={student.points} />
                    <Experiences experiences={student.experiences} />
                </section>
                <Contact email={student.email} />
            </section>

            <ProjectPage></ProjectPage>
        </Layout>
    )

}

export default App;
