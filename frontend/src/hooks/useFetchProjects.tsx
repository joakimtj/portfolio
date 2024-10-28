import { useState, useEffect } from 'react';
import { Project } from '../types';
import { endpoints } from '../config/urls';

interface UseFetchProjectsReturn {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    isLoading: boolean;
    error: string | null;
}

export const useFetchProjects = (): UseFetchProjectsReturn => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(endpoints.getProjects);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return { projects, setProjects, isLoading, error };
};