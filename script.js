const name = prompt("Как вас зовут?");
if (name === null || name.trim() === "") {
    alert("Привет, гость! Давайте посчитаем длительность ваших фильмов.");
    console.log("Пользователь: гость");
} else {
    alert(`Привет, ${name}! Давайте посчитаем длительность ваших фильмов.`);
    console.log(`Пользователь: ${name}`);
}
console.log(`Пользователь: ${name}`);

const films_durations = [30, 36, 90, 94, 180, 240, 182];
console.log("Массив длительностей фильмов: ", films_durations);

function findMax(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
function sumOfElements(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}
function filterByDuration(arr, threshold, direction = "more") {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (direction === "more" && arr[i] > threshold) {
            result.push(arr[i]);
        } else if (direction === "less" && arr[i] <= threshold) {
            result.push(arr[i]);
        }
    }
    return result;
}
const longFilms = filterByDuration(films_durations, 120, "more");
const shortFilms = filterByDuration(films_durations, 40, "less");

const totalDuration = sumOfElements(films_durations);
const longSum = sumOfElements(longFilms);
const shortSum = sumOfElements(shortFilms);
const shortCount = shortFilms.length;
const maxDuration = findMax(films_durations);

alert(`Общая длительность просмотра – ${totalDuration} минут, из них ${longSum} минут – полнометражные фильмы`);

console.log(`Короткометражек (≤ 40 минут): ${shortCount}`);
console.log(`Суммарная длительность короткометражек: ${shortSum} минут`);

console.log(`Максимальная длительность: ${maxDuration} минут`);
if (maxDuration >= 180) {
    console.log("Это почти как полноценный театральный спектакль!");
}

const add_film_button = document.getElementById("add-film");
const clear_list_button = document.getElementById("clear-list");
const toggle_theme_button = document.getElementById("toggle-theme");
const toggle_table_button = document.getElementById("toggle-table");

const tbody = document.querySelector("#films-tbody");
const table = document.querySelector("#films-table");
const allButtons = document.querySelectorAll("button");
console.log(`Кнопок: ${allButtons.length}`);

const storage_films = "watchlist_films";
const storage_theme = "watchlist_theme";

function loadFilms() {
    try {
        const saved = localStorage.getItem(storage_films);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Ошибка загрузки:", e);
        return [];
    }
}

function saveFilms(films) {
    localStorage.setItem(storage_films, JSON.stringify(films));
}
function renderFilms() {
    if (!tbody) return;
    tbody.innerHTML = "";

    const films = loadFilms();
    films.forEach((film, index) => {
        const tr = document.createElement("tr");

        const td_name = document.createElement("td");
        td_name.textContent = film.name;
        tr.appendChild(td_name);

        const td_year = document.createElement("td");
        td_year.textContent = film.year;
        tr.appendChild(td_year);

        const td_status = document.createElement("td");
        td_status.textContent = film.status;
        td_status.style.cursor = "pointer";
        td_status.addEventListener("click", () => {
            const films = loadFilms();
            films[index].status = films[index].status === "Просмотрено" ? "К просмотру" : "Просмотрено";
            saveFilms(films);
            renderFilms();
        });
        tr.appendChild(td_status);

        const td_action = document.createElement("td");
        const delete_button = document.createElement("button");
        delete_button.textContent = "Удалить";
        delete_button.type = "button";
        delete_button.addEventListener("click", () => {
            const films = loadFilms();
            films.splice(index, 1);
            saveFilms(films);
            renderFilms();
        });
        td_action.appendChild(delete_button);
        tr.appendChild(td_action);

        tbody.appendChild(tr);
    });
}
function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    if (toggle_theme_button) {
        toggle_theme_button.textContent = theme === "light" ? "Тёмная тема" : "Светлая тема";
    }
}
function getSavedTheme() {
    return localStorage.getItem(storage_theme) || "dark";
}

if (add_film_button) {
    add_film_button.addEventListener("click", () => {
        const film_name = prompt("Название фильма");
        if (!film_name || !film_name.trim()) {
            alert("Введите название фильма");
            return;
        }

        const film_year = prompt("Год выхода");
        if (!film_year || isNaN(film_year)) {
            alert("Введите корректный год");
            return;
        }

        const films = loadFilms();
        films.push({ name: film_name.trim(), year: film_year.trim(), status: "К просмотру" });
        saveFilms(films);
        renderFilms();
    });
}
if (clear_list_button) {
    clear_list_button.addEventListener("click", () => {
        if (!confirm("Удалить все фильмы?")) return;
        localStorage.removeItem(storage_films);
        renderFilms();
    });
}

if (toggle_table_button && table) {
    toggle_table_button.addEventListener("click", () => {
        const hidden = table.classList.toggle("hidden");
        toggle_table_button.textContent = hidden ? "Показать таблицу" : "Скрыть таблицу";
    });
}

if (toggle_theme_button) {
    toggle_theme_button.addEventListener("click", () => {
        const next = getSavedTheme() === "dark" ? "light" : "dark";
        localStorage.setItem(storage_theme, next);
        applyTheme(next);
    });
}
applyTheme(getSavedTheme());
renderFilms();