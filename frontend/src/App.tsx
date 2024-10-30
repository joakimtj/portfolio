import { Header } from "./Header"
import { Experiences } from "./components/Experiences"
import { Contact } from "./components/Contact"
import { Student } from "./types"
import { ProjectPage } from "./components/ProjectPage"
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
            <main className="min-h-screen bg-gray-100">
                {/* Student Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Section Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 inline-block pb-2 border-b-2 border-blue-500">
                        Student Profile
                    </h2>

                    <section id="student-section" className="space-y-12">
                        {/* Student Details Card */}
                        <section
                            id="student-details-section"
                            className="bg-white rounded-lg shadow-md p-8"
                        >
                            <div className="max-w-3xl ml-0 mr-auto">
                                <div className="mb-8">
                                    <Header
                                        student={student.name}
                                        degree={student.degree}
                                        points={student.points}
                                    />
                                </div>

                                <div className="border-t border-gray-100 pt-8">
                                    <Experiences
                                        experiences={student.experiences}
                                    />
                                </div>
                            </div>
                        </section>
                    </section>
                </div>

                {/* Projects Section */}
                <section className="border-t border-gray-200 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <ProjectPage />
                    </div>
                </section>

                {/* Contact Section */}
                <Contact email={student.email} />

            </main>
        </Layout>
    )
}

export default App;