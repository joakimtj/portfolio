import { PropsWithChildren } from "react"
import type { Project as ProjectType } from "../types"  // Changed to type-only import and renamed

type ProjectComponentProps = PropsWithChildren<ProjectType>

export default function Project({
    children,
    title,
    description,
    technologies,
    createdAt,
    publishedAt,
    isPublic,
    hasStatus,
    tags
}: Readonly<ProjectComponentProps>) {
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