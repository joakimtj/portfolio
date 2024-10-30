import { PropsWithChildren } from "react"

type ProjectProps = {
    id: number,
    title: string,
    description: string,
    technologies: string[],
    createdAt: number,
    publishedAt: number,
    isPublic: boolean,
    status: string,
    tags: string[],
}

export default function Project({
    children,
    title,
    description,
    technologies,
    createdAt,
    publishedAt,
    isPublic,
    status,
    tags
}: Readonly<PropsWithChildren<ProjectProps>>) {
    return (
        <article>
            {children}
            <h2>{title}</h2>
            <p id="createdAt">{createdAt}</p>
            <p>{description}</p>
            <ul>
                {technologies.map((technology: string, index: number) => (
                    <li id="technologies-symbol" key={index}>{technology}</li>
                ))}
            </ul>
        </article>
    )
}