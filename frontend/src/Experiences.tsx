import Experience from "./Experience"

type ExperiencesProps = {
    experiences: string[]
}

export function Experiences({ experiences }: ExperiencesProps) {

    if (!experiences || experiences.length === 0) {
        experiences = experiences || [];
        experiences.push("No experiences.");
    }

    return (
        <ul >
            {experiences.map((experience: string, index: number) =>
                <Experience key={index} description={experience}>

                </Experience>
            )}
        </ul>
    )
}