import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Database from 'better-sqlite3'
import { z } from 'zod'

const app = new Hono()
app.use('/*', cors())

// Zod schema for Project
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

// Project type interface
interface Project {
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

// Type inference from schema
type ValidatedProject = z.infer<typeof ProjectSchema>;

// Validation middleware
const validateProject = async (c: any) => {
    try {
        const body = await c.req.json();
        const validatedData = ProjectSchema.parse(body);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return { success: false, errors };
        }
        return { success: false, errors: [{ message: 'Invalid data format' }] };
    }
};

// Initialize database
const db = new Database('projects.db')

// Create table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        publishedAt INTEGER NOT NULL,
        isPublic BOOLEAN NOT NULL,
        hasStatus TEXT NOT NULL,
        tags TEXT NOT NULL
    )
`)

// Helper function to convert array to string for storage
const arrayToString = (arr: string[]) => JSON.stringify(arr)

// Helper function to convert string back to array
const stringToArray = (str: string) => JSON.parse(str)

app.get('/', (c) => {
    return c.text('Hello Hono!')
})
// Endpoint to fetch projects
app.get('/api/projects', (c) => {
    try {
        const projects = db.prepare('SELECT * FROM projects').all()

        // Convert string representations back to arrays
        const formattedProjects = projects.map(project => ({
            ...project,
            technologies: stringToArray(project.technologies),
            tags: stringToArray(project.tags)
        }))

        return c.json(formattedProjects)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return c.json({ success: false, error: 'Failed to fetch projects' }, 500)
    }
})

// POST endpoint with validation
app.post('/api/add', async (c) => {
    const validation = await validateProject(c);

    if (!validation.success) {
        return c.json({ error: 'Validation failed', details: validation.errors }, 400);
    }

    const validatedProject = validation.data;

    try {
        const projectToInsert = {
            title: validatedProject.title,
            description: validatedProject.description,
            technologies: arrayToString(validatedProject.technologies),
            createdAt: validatedProject.createdAt,
            publishedAt: validatedProject.publishedAt,
            isPublic: validatedProject.isPublic ? 1 : 0,
            hasStatus: validatedProject.hasStatus,
            tags: arrayToString(validatedProject.tags)
        };

        const stmt = db.prepare(`
            INSERT INTO projects (
                title, description, technologies, createdAt, 
                publishedAt, isPublic, hasStatus, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            projectToInsert.title,
            projectToInsert.description,
            projectToInsert.technologies,
            projectToInsert.createdAt,
            projectToInsert.publishedAt,
            projectToInsert.isPublic,
            projectToInsert.hasStatus,
            projectToInsert.tags
        );

        const newProject = {
            id: Number(result.lastInsertRowid),
            ...validatedProject
        };

        return c.json(newProject, 201);
    } catch (error) {
        console.error('Error inserting project:', error);
        return c.json({ sucess: false, error: 'Failed to create project' }, 500);
    }
});

// Endpoint to fetch single project by its id
app.get('/api/projects/:id', (c) => {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
        return c.json({ error: 'Invalid id: must be a number' }, 400)
    }

    try {
        const stmt = db.prepare('SELECT * FROM projects WHERE id = ?')
        const project = stmt.get(id)

        if (!project) {
            return c.json({ error: 'Project not found' }, 404)
        }

        // Convert stored strings back to arrays and boolean
        const formattedProject = {
            ...project,
            technologies: stringToArray(project.technologies),
            tags: stringToArray(project.tags),
            isPublic: Boolean(project.isPublic)
        }

        return c.json(formattedProject)
    } catch (error) {
        console.error('Error fetching project:', error)
        return c.json({ sucess: false, error: 'Failed to fetch project' }, 500)
    }
})

// Create a partial schema for updates where all fields are optional
const ProjectUpdateSchema = ProjectSchema.partial().extend({
    id: z.number().int().positive()  // ID is required for updates
});
// Endpoint for updating a project
app.put('/api/projects/:id', async (c) => {
    const id = Number(c.req.param('id'));

    // Validate ID
    if (isNaN(id)) {
        return c.json({ error: 'Invalid id: must be a number' }, 400);
    }

    try {
        // Check if project exists
        const existingProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!existingProject) {
            return c.json({ error: 'Project not found' }, 404);
        }

        // Get and validate update data
        const body = await c.req.json();
        const validationResult = ProjectUpdateSchema.safeParse({ ...body, id });

        if (!validationResult.success) {
            return c.json({
                error: 'Validation failed',
                details: validationResult.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            }, 400);
        }

        const updates = validationResult.data;

        // Prepare the update data
        const updateData: Record<string, any> = {
            title: updates.title,
            description: updates.description,
            technologies: updates.technologies ? arrayToString(updates.technologies) : undefined,
            createdAt: updates.createdAt,
            publishedAt: updates.publishedAt,
            isPublic: typeof updates.isPublic === 'boolean' ? (updates.isPublic ? 1 : 0) : undefined,
            hasStatus: updates.hasStatus,
            tags: updates.tags ? arrayToString(updates.tags) : undefined
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        // If no fields to update, return early
        if (Object.keys(updateData).length === 0) {
            return c.json({ error: 'No valid fields to update' }, 400);
        }

        // Create the SQL SET clause dynamically
        const setClause = Object.keys(updateData)
            .map(key => `${key} = ?`)
            .join(', ');

        const stmt = db.prepare(`
            UPDATE projects 
            SET ${setClause}
            WHERE id = ?
        `);

        // Execute the update
        const result = stmt.run(
            ...Object.values(updateData),
            id
        );

        if (result.changes === 0) {
            return c.json({ error: 'No changes made to the project' }, 400);
        }

        // Fetch and return the updated project
        const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

        // Format the response
        const formattedProject = {
            ...updatedProject,
            technologies: stringToArray(updatedProject.technologies),
            tags: stringToArray(updatedProject.tags),
            isPublic: Boolean(updatedProject.isPublic)
        };

        return c.json(formattedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return c.json({ error: 'Failed to update project' }, 500);
    }
});

app.delete('/api/delete/:id', (c) => {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
        return c.json({ error: 'Invalid id: must be a number' }, 400)
    }

    try {
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?')
        const result = stmt.run(id)

        if (result.changes === 0) {
            return c.json({ success: false, error: 'Project not found' }, 404)
        }

        return c.json({ message: 'Project deleted successfully' }, 200)
    } catch (error) {
        console.error('Error deleting project:', error)
        return c.json({ sucess: false, error: 'Failed to delete project' }, 500)
    }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})