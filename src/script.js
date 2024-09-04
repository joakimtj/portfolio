var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var form = document.getElementById("project-form");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (event) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        event.preventDefault();
        console.log("In form submit function haha");
        return [2 /*return*/];
    });
}); });
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
