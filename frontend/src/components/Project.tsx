import { PropsWithChildren } from "react"
import type { Project as ProjectType } from "../types"
import { format } from "date-fns"

type ProjectComponentProps = PropsWithChildren<ProjectType>

export default function Project({
    children,
    title,
    description,
    technologies = [],
    createdAt,
    publishedAt,
    isPublic,
    hasStatus,
    tags = []
}: Readonly<ProjectComponentProps>) {
    const formatCreatedAt = (year: number | null): string => {
        if (!year) return 'No date';
        return String(year);
    }

    const formatPublishedAt = (timestamp: number | null): string => {
        if (!timestamp) return 'Not published';
        try {
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
        <article className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            {children}

            <div className="space-y-4">
                {/* Header Section */}
                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {title || 'Untitled'}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <p id="createdAt" className="flex items-center">
                            <span className="mr-2">Created:</span>
                            <span className="font-medium">{formatCreatedAt(createdAt)}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="mr-2">Published:</span>
                            <span className="font-medium">{formatPublishedAt(publishedAt)}</span>
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                    {description || 'No description available'}
                </p>

                {/* Technologies */}
                {technologies.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700">Technologies</h3>
                        <ul className="flex flex-wrap gap-2">
                            {Array.isArray(technologies) && technologies.map((technology: string, index: number) => (
                                <li
                                    id="technologies-symbol"
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {technology}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
                        <ul className="flex flex-wrap gap-2">
                            {Array.isArray(tags) && tags.map((tag: string, index: number) => (
                                <li
                                    id="tag-symbol"
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    )
}