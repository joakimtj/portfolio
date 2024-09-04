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
            var language = document.createElement("p");
            language.textContent = "written in: ".concat(project.languages);
            language.id = "language";
            article.appendChild(language);
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
