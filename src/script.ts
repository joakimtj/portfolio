import { Project } from '../types/Project.js'

const projectsSection = document.getElementById("projects-section") as HTMLElement; 
const form = document.getElementById("project-form") as HTMLFormElement;
const projects: Project[] = [];

form?.addEventListener("submit", async event => {
    event.preventDefault();

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLInputElement).value;
    const createdYear = (document.getElementById('createdYear') as HTMLInputElement).value;
    const technologies = (document.getElementById('technologies') as HTMLInputElement).value;
    const technologiesSplit = technologies.split(",");
    const project: Project = { title: title, description: description, createdAt: createdYear, technologies: technologiesSplit };

    projects.push(project);
    updateProjectList();

    try {
        const response = await fetch("http://localhost:3999/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
            }
        );

        if (response.status === 201) {
            console.log("Project stored on the server.");
        } else {
            console.error("Error when storing project on the server.");
        } 
    } catch (error) {
        console.error("Error when sending data to the server:", error);
    }
});

function updateProjectList() {
    console.log(projects);
    projectsSection.innerHTML = "";

    for (const project of projects)
    {
        const article = document.createElement("article") as HTMLElement;

        const h2 = document.createElement("h2") as HTMLElement;
        h2.textContent = `${project.title}`;
        article.appendChild(h2);

        const createdAt = document.createElement("p") as HTMLElement;
        createdAt.id = "createdAt";
        createdAt.textContent = `${project.createdAt}`;
        article.appendChild(createdAt);

        const paragraph = document.createElement("p") as HTMLElement;
        paragraph.textContent = `${project.description}`;
        article.appendChild(paragraph);

        const technologiesContainer = document.createElement("section") as HTMLElement;
        technologiesContainer.id = "technologies-container";
        article.appendChild(technologiesContainer);
        for (const technologies of project.technologies)
        {
            const technologiesE = document.createElement("p") as HTMLElement;
            technologiesE.textContent = `${technologies}`;
            technologiesE.id = `technologies`;
            technologiesContainer.appendChild(technologiesE);
        }
        projectsSection?.appendChild(article);
    }
}

function loadFromAPI() {
    fetch("http://localhost:3999")
        .then((response) => response.json())
        .then((data) => {
            projects.push(...data);
            updateProjectList();
        })
        .catch((error) => {
            console.error("Error fetching data from the server:", error);
        })
}

function loadJSON() {
    fetch("../projects.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for (const project of data)
            {
                projects.push({ ...project });
            }
        })
}

loadJSON();
loadFromAPI();