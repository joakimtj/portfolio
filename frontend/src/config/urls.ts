const baseUrl = import.meta.env.baseUrl ?? "http://localhost:3000"

const endpoints = {
    getProjects: '${baseUrl}/projects',
    addProject: '${baseUrl}/add',
    deleteProject: '${baseUrl}/delete'
}

export { baseUrl, endpoints as endpoints }; 