import { PropsWithChildren } from "react"
import type { Project as ProjectType } from "../types"
import { format } from "date-fns"

type ProjectComponentProps = PropsWithChildren<ProjectType>

export default function Project({
    children,
    title,
    description,
    technologies = [], // Provide default empty array
    createdAt,
    publishedAt,
    isPublic,
    hasStatus,
    tags = []  // Provide default empty array
}: Readonly<ProjectComponentProps>) {
    // For createdAt which is just a year
    const formatCreatedAt = (year: number | null): string => {
        if (!year) return 'No date';
        return String(year);
    }

    // For publishedAt which is a timestamp
    const formatPublishedAt = (timestamp: number | null): string => {
        if (!timestamp) return 'Not published';
        try {
            // Validate that timestamp is a proper number
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return format(date, 'MMMM d, yyyy');
        } catch (error) {
            console.error('Error formatting publishedAt:', error);
            return 'Invalid date';
        }
    }

    return (
        <article>
            {children}
            <h2>{title || 'Untitled'}</h2>
            <p id="createdAt">created: {formatCreatedAt(createdAt)}</p>
            <p>{description || 'No description available'}</p>
            <ul>
                {Array.isArray(technologies) && technologies.map((technology: string, index: number) => (
                    <li id="technologies-symbol" key={index}>{technology}</li>
                ))}
            </ul>
            <p>published: {formatPublishedAt(publishedAt)}</p>
            <ul>
                {Array.isArray(tags) && tags.map((tag: string, index: number) => (
                    <li id="tag-symbol" key={index}>{tag}, </li>
                ))}
            </ul>
        </article>
    )
}