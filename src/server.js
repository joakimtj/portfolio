import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from "@hono/node-server/serve-static";
import projects from "./projects.json" assert { type: "json" };
const app = new Hono();
app.use('/*', serveStatic({ root: './' }));
const storedProjects = [];
// Endpoint to retrieve all projects
app.get('/projects', async (c) => { c.json(projects); });
app.post('/add', async (c) => {
    const newProject = await c.req.json();
    console.log(newProject);
});
const port = 3000;
// Start the server
console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port
});