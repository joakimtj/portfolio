import { Hono } from 'hono'
import * as ProjectController from 'controllers/project.controller'

const router = new Hono()

router.get('/projects', ProjectController.getAllProjects)
router.get('/projects/:id', ProjectController.getProjectById)
router.post('/add', ProjectController.createProject)
router.put('/projects/:id', ProjectController.updateProject)
router.delete('/delete/:id', ProjectController.deleteProject)

export default router