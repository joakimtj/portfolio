import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as fs from 'fs'
import * as path from 'path'

const app = new Hono()

app.use('/*', cors());

interface Project {
    id: number
    title: string
    description: string
    technologies: string[]
    createdAt: number
    publishedAt: number
    isPublic: boolean
    status: string
    tags: string[]
}

const jsonPath = path.join(__dirname, 'projects.json');

// Function to read JSON data
function readJsonData(): Project[] {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
}

// Function to write JSON data
function writeJsonData(data: Project[]): void {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))
}

let jsonData: Project[] = readJsonData()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/projects', (c) => {
    return c.json(jsonData);
})

app.post('/add', async (c) => {
    const body = await c.req.json()

    // Validate the incoming data
    if (!body.title || !body.description || !body.technologies || !body.date) {
        return c.json({ error: 'Missing required fields' }, 400)
    }

    // Create a new project object
    const newProject: Project = {
        id: jsonData.length > 0 ? Math.max(...jsonData.map(p => p.id)) + 1 : 0,
        title: body.title,
        description: body.description,
        technologies: body.technologies,
        createdAt: body.createdAt,
        publishedAt: body.publishedAt,
        isPublic: body.isPublic,
        status: body.status,
        tags: body.tags
    }

    // Add the new project to the array
    jsonData.push(newProject)

    // Save the updated data back to the file
    writeJsonData(jsonData)

    return c.json(newProject, 201)
})

app.delete('/delete/:id', async (c) => {
    console.log("In delete");
    const id = Number(c.req.param('id'));
    console.log("Attempting to delete project with id:", id);

    if (isNaN(id)) {
        console.log("Invalid ID");
        return c.json({ error: 'Invalid id: must be a number' }, 400);
    }

    const initialLength = jsonData.length;
    jsonData = jsonData.filter(project => project.id !== id);
    console.log(`Initial length: ${initialLength}, New length: ${jsonData.length}`);

    if (initialLength === jsonData.length) {
        console.log("Project not found");
        return c.json({ error: 'Project not found' }, 404);
    }

    writeJsonData(jsonData);
    console.log("Project deleted successfully");
    return c.json({ message: 'Project deleted successfully' }, 200);
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})
