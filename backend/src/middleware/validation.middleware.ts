import { Context } from 'hono'
import { z } from 'zod'
import { ProjectSchema } from '../schemas/project.schema'

export const validateProject = async (c: Context) => {
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
