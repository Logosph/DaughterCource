console.log("hiii");

//
//
// поп-апы
function openModal(popup) {
    popup.classList.remove("hidden");
}

function closeModal(popup) {
    popup.classList.add("hidden");
}

async function addMeeting(name, date, time, duration, link, capacity) {
    const response = await fetch("http://api.local/add_meeting", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            name: name,
            date: date,
            time: time,
            duration: duration,
            link: link,
            capacity: capacity
        })
    });
    console.log("response", response);

    if (response.status === 200) {
        console.log("Встреча успешно добавлена!");
    } else {
        console.error("Ошибка при добавлении встречи.");
    }
}

// Получение списка встреч
async function getMeetings() {
    console.log("Получение списка встреч...");
    const response = await fetch("http://api.local/get_meetings", {
        method: "GET",
    });
    console.log("response", response);

    if (response.status === 200) {
        const meetings = await response.json();
        console.log("Список встреч:", meetings);
        return meetings;
    } else {
        console.error("Ошибка при получении списка встреч.");
        return null;
    }
}

//
//
// карточки

const cardActiveTemplate = document.querySelector(
    "#active-card-template"
).content;
const cardScheduleTemplate = document.querySelector(
    "#scheduled-card-template"
).content;

const cardTitleInput = document.querySelector(".popup__card-name");
const cardCountInput = document.querySelector(".popup__card-count");
const cardLinkInput = document.querySelector(".popup__type_url");
const cardDatekInput = document.querySelector(".popup__card-date");
const cardTimeInput = document.querySelector(".popup__card-time");
const cardDurationInput = document.querySelector(".popup__card-duration");

const cardActivePlacesList = document.querySelector(".active-cards__list");
const cardSchedulePlacesList = document.querySelector(".scheduled-cards__list");

function createCard(name, count, date, time, duration) {
    const cardElement = cardScheduleTemplate
        .querySelector(".scheduled-cards__item")
        .cloneNode(true);

    const cardTitle = cardElement.querySelector(".card__title");
    const cardCount = cardElement.querySelector(".card__members-count");
    const cardDuration = cardElement.querySelector(".card__duartion-count");
    const cardDate = cardElement.querySelector(".card__date");
    const cardTime = cardElement.querySelector(".card__time");

    cardTitle.textContent = name;
    cardCount.textContent = count;
    cardDuration.textContent = duration;
    cardDate.textContent = date;
    cardTime.textContent = time;

    const cardDeleteButton = cardElement.querySelector(".delete-icon");

    cardDeleteButton.addEventListener("click", function (evt) {
        evt.target.closest(".scheduled-cards__item").remove();
    });

    return cardElement;
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    cardSchedulePlacesList.prepend(
        createCard(
            cardTitleInput.value,
            cardCountInput.value,
            cardDatekInput.value,
            cardTimeInput.value,
            cardDurationInput.value
        )
    );
    addMeeting(
        cardTitleInput.value,
        cardDatekInput.value,
        cardTimeInput.value,
        cardDurationInput.value,
        cardLinkInput.value,
        cardCountInput.value
    );
    closeModal(cardPopup);
}

//
// поп-ап - карточки
const cardPopup = document.querySelector(".popup");
const cardAddButton = document.querySelector(".add-meet-btn");
const cardForm = cardPopup.querySelector(".popup__form");

cardAddButton.addEventListener("click", function () {
    openModal(cardPopup);
});

cardForm.addEventListener("submit", handleCardFormSubmit);


async function displayMeetings() {
    const response = await getMeetings();

    if (response && response.meetings) {
        const meetings = response.meetings;
        meetings.forEach((meeting) => {
            const {name, capacity, date, time, duration} = meeting;
            const card = createCard(name, capacity, date, time, duration);
            cardSchedulePlacesList.appendChild(card);
        });
    }
}


displayMeetings().then(r => console.log("meetings", r));
