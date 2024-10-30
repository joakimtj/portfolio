import { Context } from 'hono'
import db from '../db/database'
import { arrayToString, stringToArray } from 'utils/array-helpers'
import { validateProject } from '../middleware/validation.middleware'
import { ProjectUpdateSchema } from '../schemas/project.schema'

export const getAllProjects = (c: Context) => {
    try {
        const projects = db.prepare('SELECT * FROM projects').all()
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
}

export const getProjectById = (c: Context) => {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
        return c.json({ succes: false, error: 'Invalid id: must be a number' }, 400)
    }

    try {
        const stmt = db.prepare('SELECT * FROM projects WHERE id = ?')
        const project = stmt.get(id)

        if (!project) {
            return c.json({ success: false, error: 'Project not found' }, 404)
        }

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
}

export const createProject = async (c: Context) => {
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
}

export const updateProject = async (c: Context) => {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
        return c.json({ error: 'Invalid id: must be a number' }, 400);
    }

    try {
        const existingProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!existingProject) {
            return c.json({ error: 'Project not found' }, 404);
        }

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

        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        if (Object.keys(updateData).length === 0) {
            return c.json({ error: 'No valid fields to update' }, 400);
        }

        const setClause = Object.keys(updateData)
            .map(key => `${key} = ?`)
            .join(', ');

        const stmt = db.prepare(`
            UPDATE projects 
            SET ${setClause}
            WHERE id = ?
        `);

        const result = stmt.run(
            ...Object.values(updateData),
            id
        );

        if (result.changes === 0) {
            return c.json({ error: 'No changes made to the project' }, 400);
        }

        const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

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
}

export const deleteProject = (c: Context) => {
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
}
