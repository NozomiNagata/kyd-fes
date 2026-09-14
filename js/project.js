"use strict";

async function showProjects() {
  const projectList = document.getElementById("project-list");

  if (!projectList) {
    console.error("project-list が見つかりません");
    return;
  }

  try {
    const response = await fetch("data/events.json");

    if (!response.ok) {
      throw new Error("企画データを読み込めませんでした。");
    }

    const events = await response.json();

    projectList.innerHTML = "";

    events.forEach((event) => {
      projectList.innerHTML += `
        <a href="event-detail.html?id=${event.id}" class="list">
          <figure>
            <img src="${event.image}" alt="${event.name}">
          </figure>

          <div class="text">
            <h4>${event.name}</h4>
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

    projectList.innerHTML = `
      <p>企画一覧を読み込めませんでした。</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", showProjects);

"use strict";

let allEvents = [];

document.addEventListener("DOMContentLoaded", async function () {
  await loadProjects();
  setupFilter();
});

async function loadProjects() {
  const projectList = document.getElementById("project-list");

  try {
    const response = await fetch("data/events.json");

    if (!response.ok) {
      throw new Error("企画データを読み込めませんでした。");
    }

    allEvents = await response.json();

    showProjects(allEvents);

  } catch (error) {
    console.error(error);

    projectList.innerHTML = `
      <p>企画一覧を読み込めませんでした。</p>
    `;
  }
}

function setupFilter() {
  const tagFilter = document.getElementById("tag-filter");

  if (!tagFilter) {
    return;
  }

  tagFilter.addEventListener("change", function () {
    const selectedTag = tagFilter.value;

    if (selectedTag === "all") {
      showProjects(allEvents);
      return;
    }

    const filteredEvents = allEvents.filter((event) => {
      return event.tag && event.tag.includes(selectedTag);
    });

    showProjects(filteredEvents);
  });
}

function showProjects(events) {
  const projectList = document.getElementById("project-list");

  if (events.length === 0) {
    projectList.innerHTML = `
      <p>当てはまる企画がありません。</p>
    `;
    return;
  }

  projectList.innerHTML = "";

  events.forEach((event) => {
    projectList.innerHTML += `
      <a href="event-detail.html?id=${event.id}" class="list">
        <figure>
          <img src="${event.image}" alt="${event.name}">
        </figure>

        <div class="text">
          <h4>${event.group}</h4>
          <h4>${event.name}</h4>
          <p>
            <i class="fa-solid fa-location-dot"></i>
            ${event.floor} ${event.room}
          </p>
        </div>
      </a>
    `;
  });
}