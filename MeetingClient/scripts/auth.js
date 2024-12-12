const regButton = document.querySelector(".sign-up-btn");
const regDiv = document.querySelector(".sign-up");
const regLink = document.querySelector("#sign-up-link");

const loginDiv = document.querySelector(".log-in");
const loginButton = document.querySelector(".log-in-btn");
const loginLink = document.querySelector("#log-in-link");

const main = document.querySelector(".main");

const API_URL_BASE = "http://api.local";

function reg() {
    regDiv.classList.remove("hidden");
    loginDiv.classList.add("hidden");

    main.classList.remove("main-auth-log-in");
    main.classList.add("main-auth-sign-up");
}

function login() {
    regDiv.classList.add("hidden");
    loginDiv.classList.remove("hidden");

    main.classList.remove("main-auth-sign-up");
    main.classList.add("main-auth-log-in");
}

regButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    reg();
});
loginButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    login();
});
regLink.addEventListener("click", (evt) => {
    evt.preventDefault();
    reg();
});
loginLink.addEventListener("click", (evt) => {
    evt.preventDefault();
    login();
});



const loginForm = document.querySelector(".log-in-form");

loginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const username = document.querySelector("#username-log").value;  // аче)
    const password = document.querySelector("#password-log").value;
    await proceedLogin(username, password);
});

const signupForm = document.querySelector(".sign-up-form");

signupForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const username = document.querySelector("#username").value;  // аче)
    const password = document.querySelector("#password").value;
    await signup(username, password);
});


async function checkAuth() {
    const jwtToken = getCookie("jwt");

    if (jwtToken) {
        const response = await fetch(API_URL_BASE + "/login", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setCookie("jwt", data.token);
            console.log("Авторизация успешна!");
            window.location.href = "/index.html";
        } else {
            console.log("Токен недействителен. Редирект на страницу авторизации.");
            redirectToLogin();
        }
    } else {
        console.log("Токен отсутствует. Редирект на страницу авторизации.");
        redirectToLogin();
    }
}

async function proceedLogin(username, password) {
    console.log("Авторизация...");
    const response = await fetch("http://api.local/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: username,
            password: password
        })
    });
    console.log("response", response);

    if (response.status === 200) {
        const data = await response.json();
        setCookie("jwt", data.token);
        console.log("Авторизация успешна!");
        window.location.href = "/index.html";
    } else {
        console.log(
            "Токен недействителен. Перенаправляем на страницу авторизации."
        );
        redirectToLogin();
    }
}

async function signup(username, password) {
    console.log("Регистрация...");
    const response = await fetch(API_URL_BASE + "/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: username,
            password: password
        })
    });
    console.log("response", response);
    if (response.status === 201) {
        const data = await response.json();
        setCookie("jwt", data.token);
        console.log("Регистрация успешна!");
        await checkAuth();
    } else if (response.status === 409) {
        console.error("Пользователь с таким именем уже существует.");
    } else {
        console.error("Ошибка регистрации.");
    }
}

function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

function redirectToLogin() {
    window.location.href = "/auth.html";
}
