import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Database from 'better-sqlite3'

const app = new Hono()
app.use('/*', cors())

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
        status TEXT NOT NULL,
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
        return c.json({ error: 'Failed to fetch projects' }, 500)
    }
})

app.post('/api/add', async (c) => {
    const body = await c.req.json()

    // Validate the incoming data
    if (!body.title || !body.description || !body.technologies || !body.createdAt) {
        return c.json({ error: 'Missing required fields' }, 400)
    }

    try {
        // Convert and validate data for SQLite
        const projectToInsert = {
            title: String(body.title),
            description: String(body.description),
            technologies: arrayToString(Array.isArray(body.technologies) ? body.technologies : []),
            createdAt: Number(body.createdAt),
            publishedAt: body.publishedAt ? Number(body.publishedAt) : Date.now(),
            isPublic: body.isPublic ? 1 : 0,  // Convert boolean to integer
            status: String(body.status || 'in_progress'),
            tags: arrayToString(Array.isArray(body.tags) ? body.tags : [])
        }

        // Validate numeric fields
        if (isNaN(projectToInsert.createdAt) || isNaN(projectToInsert.publishedAt)) {
            return c.json({ error: 'Invalid date format' }, 400)
        }

        const stmt = db.prepare(`
            INSERT INTO projects (
                title, description, technologies, createdAt, 
                publishedAt, isPublic, status, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)

        const result = stmt.run(
            projectToInsert.title,
            projectToInsert.description,
            projectToInsert.technologies,
            projectToInsert.createdAt,
            projectToInsert.publishedAt,
            projectToInsert.isPublic,  // Now storing as 0 or 1
            projectToInsert.status,
            projectToInsert.tags
        )

        // Convert the data back to the expected format for the response
        const newProject = {
            id: Number(result.lastInsertRowid),
            title: body.title,
            description: body.description,
            technologies: body.technologies,
            createdAt: projectToInsert.createdAt,
            publishedAt: projectToInsert.publishedAt,
            isPublic: Boolean(projectToInsert.isPublic),
            status: projectToInsert.status,
            tags: body.tags || []
        }

        return c.json(newProject, 201)
    } catch (error) {
        console.error('Error inserting project:', error)
        return c.json({ error: 'Failed to create project' }, 500)
    }
})

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
        return c.json({ error: 'Failed to fetch project' }, 500)
    }
})

app.delete('/api/delete/:id', (c) => {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
        return c.json({ error: 'Invalid id: must be a number' }, 400)
    }

    try {
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?')
        const result = stmt.run(id)

        if (result.changes === 0) {
            return c.json({ error: 'Project not found' }, 404)
        }

        return c.json({ message: 'Project deleted successfully' }, 200)
    } catch (error) {
        console.error('Error deleting project:', error)
        return c.json({ error: 'Failed to delete project' }, 500)
    }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})