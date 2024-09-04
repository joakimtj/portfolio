const form = document.getElementById("project-form");

function loadJSON() {
    fetch("../projects.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const projectsSection = document.getElementById("projects-section");
            for (const project of data)
            {
                const article = document.createElement("article");

                const h2 = document.createElement("h2");
                h2.textContent = `${project.title}`;
                article.appendChild(h2);
                
                const languageContainer = document.createElement("section");
                languageContainer.id = "language-container";
                article.appendChild(languageContainer);
                for (const language of project.languages)
                {
                    console.log(language);
                    const languageE = document.createElement("p");
                    languageE.textContent = `${language}`;
                    languageE.id = `language`;
                    languageContainer.appendChild(languageE);
                }
                
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                img.src="assets/temp-img.png";
                img.alt="a temporary image";
                figure.appendChild(img);
                article.appendChild(figure);

                const paragraph = document.createElement("p");
                paragraph.textContent = `${project.description}`;
                article.appendChild(paragraph);

                projectsSection?.appendChild(article);
            }
        })
}

loadJSON();