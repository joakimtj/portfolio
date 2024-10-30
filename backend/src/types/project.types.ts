export interface Project {
    id: number
    title: string
    description: string
    technologies: string[]
    createdAt: number
    publishedAt: number
    isPublic: boolean
    hasStatus: string
    tags: string[]
}