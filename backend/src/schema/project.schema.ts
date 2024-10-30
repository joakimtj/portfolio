import { z } from 'zod'

const ProjectSchema = z.object({
    id: z.number().optional(), // Optional for creation, required for updates
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description must be less than 1000 characters"),
    technologies: z.array(z.string())
        .min(1, "At least one technology is required")
        .max(20, "Maximum 20 technologies allowed"),
    createdAt: z.number()
        .int()
        .min(1900, "Year must be after 1900")
        .max(new Date().getFullYear(), "Year cannot be in the future"),
    publishedAt: z.number()
        .int(),
    isPublic: z.boolean(),
    hasStatus: z.enum(["in_progress", "completed", "planned", "archived"]),
    tags: z.array(z.string())
        .max(10, "Maximum 10 tags allowed")
});

export type Test = z.infer<typeof ProjectSchema>