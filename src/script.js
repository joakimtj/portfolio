var form = document.getElementById("project-form");
function loadJSON() {
    fetch("../projects.json")
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        var projectsSection = document.getElementById("projects-section");
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var project = data_1[_i];
            var article = document.createElement("article");
            var h2 = document.createElement("h2");
            h2.textContent = "".concat(project.title);
            article.appendChild(h2);
            var languageContainer = document.createElement("section");
            languageContainer.id = "language-container";
            article.appendChild(languageContainer);
            for (var _a = 0, _b = project.languages; _a < _b.length; _a++) {
                var language = _b[_a];
                console.log(language);
                var languageE = document.createElement("p");
                languageE.textContent = "".concat(language);
                languageE.id = "language";
                languageContainer.appendChild(languageE);
            }
            var figure = document.createElement("figure");
            var img = document.createElement("img");
            img.src = "assets/temp-img.png";
            img.alt = "a temporary image";
            figure.appendChild(img);
            article.appendChild(figure);
            var paragraph = document.createElement("p");
            paragraph.textContent = "".concat(project.description);
            article.appendChild(paragraph);
            projectsSection === null || projectsSection === void 0 ? void 0 : projectsSection.appendChild(article);
        }
    });
}
loadJSON();
