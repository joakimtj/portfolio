var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("project-form");
const projects = [];
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    console.log("In form submit function haha");
}));
function loadJSON() {
    fetch("../projects.json")
        .then((response) => {
        return response.json();
    })
        .then((data) => {
        const projectsSection = document.getElementById("projects-section");
        for (const project of data) {
            projects.push(Object.assign({}, project));
            const article = document.createElement("article");
            const h2 = document.createElement("h2");
            h2.textContent = `${project.title}`;
            article.appendChild(h2);
            const languageContainer = document.createElement("section");
            languageContainer.id = "language-container";
            article.appendChild(languageContainer);
            for (const language of project.languages) {
                const languageE = document.createElement("p");
                languageE.textContent = `${language}`;
                languageE.id = `language`;
                languageContainer.appendChild(languageE);
            }
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = "assets/temp-img.png";
            img.alt = "a temporary image";
            figure.appendChild(img);
            article.appendChild(figure);
            const paragraph = document.createElement("p");
            paragraph.textContent = `${project.description}`;
            article.appendChild(paragraph);
            projectsSection === null || projectsSection === void 0 ? void 0 : projectsSection.appendChild(article);
        }
    });
}
loadJSON();
export {};
