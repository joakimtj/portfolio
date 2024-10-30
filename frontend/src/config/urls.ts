const baseUrl = import.meta.env.baseUrl ?? "http://localhost:3000"

const endpoints = {
    getProjects: `${baseUrl}/api/projects`,
    addProject: `${baseUrl}/api/add`,
    deleteProject: `${baseUrl}/api/delete`
}

export { baseUrl, endpoints as endpoints }; 