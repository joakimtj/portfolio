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
                projects.push({ ...project })

                const article = document.createElement("article") as HTMLElement;

                const h2 = document.createElement("h2") as HTMLElement;
                h2.textContent = `${project.title}`;
                article.appendChild(h2);
                
                const languageContainer = document.createElement("section") as HTMLElement;
                languageContainer.id = "language-container";
                article.appendChild(languageContainer);
                for (const language of project.languages)
                {
                    const languageE = document.createElement("p") as HTMLElement;
                    languageE.textContent = `${language}`;
                    languageE.id = `language`;
                    languageContainer.appendChild(languageE);
                }
                
                const figure = document.createElement("figure") as HTMLElement;
                const img = document.createElement("img") as HTMLImageElement;
                img.src="assets/temp-img.png";
                img.alt="a temporary image";
                figure.appendChild(img);
                article.appendChild(figure);

                const paragraph = document.createElement("p") as HTMLElement;
                paragraph.textContent = `${project.description}`;
                article.appendChild(paragraph);

                projectsSection?.appendChild(article);
            }
        })
}

loadJSON();