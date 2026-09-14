"use strict";

document.addEventListener("DOMContentLoaded", showPickupProjects);

async function showPickupProjects() {
  const pickupList = document.getElementById("pickup-project-list");

  if (!pickupList) {
    return;
  }

  try {
    const response = await fetch("data/events.json");

    if (!response.ok) {
      throw new Error("企画データを読み込めませんでした。");
    }

    const events = await response.json();

    // events.json の中からランダムに6個選ぶ
    const randomEvents = shuffleArray(events).slice(0, 6);

    pickupList.innerHTML = "";

    randomEvents.forEach((event) => {
      const projectName = event.name.replace(/\n/g, "<br>");

      pickupList.innerHTML += `
        <a href="event-detail.html?id=${event.id}" class="list">
          <figure>
            <img src="${event.image}" alt="${event.name}">
          </figure>

          <div class="text">
            <h4 class="project-title">${event.group}</h4>
            <p>
              <i class="fa-solid fa-location-dot"></i>
              ${event.floor} ${event.room}
            </p>
          </div>
        </a>
      `;
    });

  } catch (error) {
    console.error(error);

    pickupList.innerHTML = `
      <p>企画を読み込めませんでした。</p>
    `;
  }
}

function shuffleArray(array) {
  const copiedArray = [...array];

  for (let i = copiedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [copiedArray[i], copiedArray[randomIndex]] =
      [copiedArray[randomIndex], copiedArray[i]];
  }

  return copiedArray;
}