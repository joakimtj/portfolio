export type Student = {
    name: string,
    degree: string,
    points: number,
    email: string,
    experiences: string[]
}

export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    createdAt: number
    publishedAt: number
    public: boolean
    status: string
    tags: string[]
}