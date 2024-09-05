import { Project } from '../types/Project.js'

const projectsSection = document.getElementById("projects-section") as HTMLElement; 
const form = document.getElementById("project-form") as HTMLFormElement;
const projects: Project[] = [];

form?.addEventListener("submit", async event => {
    event.preventDefault();
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLInputElement).value;
    const createdYear = (document.getElementById('createdYear') as HTMLInputElement).value;
    const technologiesElement = document.getElementById('technologies') as HTMLInputElement | null;
    let technologiesArray: string[] = [];
    if (technologiesElement) {
        const technologiesValue = technologiesElement.value.trim(); // Get value and trim whitespace
        if (technologiesValue) {
            // Split the string only if it is non-empty
            technologiesArray = technologiesValue.split(',').map(tech => tech.trim());
            console.log(technologiesArray); // Now it's an array of technologies
        } else {
            console.error('Technologies field is empty');
        }
    } else {
        console.error('Technologies input element not found');
    }
    const project: Project = { title: title, description: description, createdAt: createdYear, technologies: technologiesArray };

    projects.push(project);
    updateProjectList();
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
            technologiesE.id = `technologies-symbol`;
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
                updateProjectList();
            }
        })
}

loadJSON();
