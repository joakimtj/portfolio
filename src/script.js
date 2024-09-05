var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const projectsSection = document.getElementById("projects-section");
const form = document.getElementById("project-form");
const projects = [];
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const createdYear = document.getElementById('createdYear').value;
    const technologies = document.getElementById('technologies').value;
    const technologiesSplit = technologies.split(",");
    const project = { title: title, description: description, createdAt: createdYear, technologies: technologiesSplit };
    projects.push(project);
    updateProjectList();
    try {
        const response = yield fetch("http://localhost:3999/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
        });
        if (response.status === 201) {
            console.log("Project stored on the server.");
        }
        else {
            console.error("Error when storing project on the server.");
        }
    }
    catch (error) {
        console.error("Error when sending data to the server:", error);
    }
}));
function updateProjectList() {
    console.log(projects);
    projectsSection.innerHTML = "";
    for (const project of projects) {
        const article = document.createElement("article");
        const h2 = document.createElement("h2");
        h2.textContent = `${project.title}`;
        article.appendChild(h2);
        const createdAt = document.createElement("p");
        createdAt.id = "createdAt";
        createdAt.textContent = `${project.createdAt}`;
        article.appendChild(createdAt);
        const paragraph = document.createElement("p");
        paragraph.textContent = `${project.description}`;
        article.appendChild(paragraph);
        const technologiesContainer = document.createElement("section");
        technologiesContainer.id = "technologies-container";
        article.appendChild(technologiesContainer);
        for (const technologies of project.technologies) {
            const technologiesE = document.createElement("p");
            technologiesE.textContent = `${technologies}`;
            technologiesE.id = `technologies`;
            technologiesContainer.appendChild(technologiesE);
        }
        projectsSection === null || projectsSection === void 0 ? void 0 : projectsSection.appendChild(article);
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
    });
}
function loadJSON() {
    fetch("../projects.json")
        .then((response) => {
        return response.json();
    })
        .then((data) => {
        for (const project of data) {
            projects.push(Object.assign({}, project));
            updateProjectList();
        }
    });
}
loadJSON();
export {};
