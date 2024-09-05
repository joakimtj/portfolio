import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Project } from './types/Project';
import { cors } from "hono/cors";
import fs from "node:fs/promises";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/*", cors());

app.use("/*", serveStatic({root: "./"}));

const projects: Project[] = [];

// Endpoint to retrieve all projects
app.get('/projects', async (c) => {
  const data = await fs.readFile("./projects.json", "utf8");
  const dataAsJson = JSON.parse(data);
  projects.push(...dataAsJson);
  console.log(projects);
});



// Start the server
serve(app);