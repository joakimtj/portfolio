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
    date: number;
}