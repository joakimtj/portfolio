import { Project } from '../types/Project.js'

const form = document.getElementById("project-form") as HTMLFormElement;
const projects: Project[] = [];

form?.addEventListener("submit", async event => {
    event.preventDefault();
    console.log("In form submit function haha");
})

function loadJSON() {
    fetch("../projects.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const projectsSection = document.getElementById("projects-section") as HTMLElement;
            for (const project of data)
            {
                projects.push({ ...project });
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
        })
}

loadJSON();