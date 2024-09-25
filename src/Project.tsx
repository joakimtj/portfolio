import { PropsWithChildren } from "react"

type ProjectProps = {
    id: number,
    title: string,
    description: string,
    technologies: string[],
    date: string,
}

export default function Project({
    children,
    title,
    description,
    technologies,
    date
}: Readonly<PropsWithChildren<ProjectProps>>) {
    return (
        <article>
            {children}
            <h2>{title}</h2>
            <p id="date">{date}</p>
            <p>{description}</p>
            <ul>
                {technologies.map((technology: string, index: number) => (
                    <li id="technologies-symbol" key={index}>{technology}</li>
                ))}
            </ul>
        </article>
    )
}