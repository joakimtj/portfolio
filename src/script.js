const projectsSection = document.getElementById("projects-section");
const form = document.getElementById("project-form");
const projects = [];
form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const createdYear = document.getElementById('createdYear').value;
    const technologiesElement = document.getElementById('technologies');
    let technologiesArray = [];
    if (technologiesElement) {
        const technologiesValue = technologiesElement.value.trim(); // Get value and trim whitespace
        if (technologiesValue) {
            // Split the string only if it is non-empty
            technologiesArray = technologiesValue.split(',').map(tech => tech.trim());
            console.log(technologiesArray); // Now it's an array of technologies
        }
        else {
            console.error('Technologies field is empty');
        }
    }
    else {
        console.error('Technologies input element not found');
    }
    const project = { title: title, description: description, createdAt: createdYear, technologies: technologiesArray };
    projects.push(project);
    updateProjectList();
    try {
        const response = await fetch("http://localhost:3000/add", {
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
});
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
    });
}
function loadJSON() {
    fetch("../projects.json")
        .then((response) => {
        return response.json();
    })
        .then((data) => {
        for (const project of data) {
            projects.push({ ...project });
            updateProjectList();
        }
    });
}
loadJSON();
export {};
