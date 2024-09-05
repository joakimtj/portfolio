import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Project } from '../types/Project';
import { serveStatic } from "@hono/node-server/serve-static";
import projects from "./projects.json" assert { type: "json" };

const app = new Hono();

app.use('/*', serveStatic({ root: './src' }));

const storedProjects: Project[] = [...projects];

// Endpoint to retrieve all projects
app.get('/projects', async (c) => {
  try {
    // Ensure the array is initialized and accessible
    if (!storedProjects || storedProjects.length === 0) {
      return c.json({ message: 'No projects found' }, 404); // Return 404 if no projects
    }

    // Return the projects array as JSON
    return c.json(storedProjects, 200);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    return c.json({ error: 'Failed to retrieve projects' }, 500);
  }
});

app.post('/add', async (c) => {
  try {
    const newProject = await c.req.json(); // Parse the incoming JSON data
    console.log('New project received:', newProject);
    
    // Push the new project into the storedProjects array
    storedProjects.push(newProject);
    console.log('Updated project list:', storedProjects);
    
    // Return a success response with status 201
    return c.json({ message: 'Project added successfully!' }, 201);
  } catch (error) {
    // Log any errors that occur
    console.error('Error processing the request:', error);
    
    // Return an error response with status 500
    return c.json({ error: 'Failed to add project' }, 500);
  }
});

const port = 3000;

// Start the server
console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port
 });