"use strict";

const startHour = 9;
const endHour = 15.25;

// 1時間あたりの横幅。大きくすると時間の間隔が広くなる
const hourWidth = 140;

// 1行あたりの高さ
const rowHeight = 90;

const leftPadding = 30;


let allEvents = [];
let allSchedules = [];

document.addEventListener("DOMContentLoaded", async function () {
  await loadData();
  setupDayTabs();
  showTimetable(1);
});

async function loadData() {
  const eventsResponse = await fetch("data/events.json");
  const timetableResponse = await fetch("data/timetable.json");

  if (!eventsResponse.ok || !timetableResponse.ok) {
    throw new Error("データを読み込めませんでした。");
  }

  allEvents = await eventsResponse.json();
  allSchedules = await timetableResponse.json();
}

function setupDayTabs() {
  const tabs = document.querySelectorAll(".day-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const day = Number(tab.dataset.day);
      showTimetable(day);
    });
  });
}

function showTimetable(day) {
  const area = document.getElementById("timetable-area");

  const schedules = allSchedules.filter((item) => item.day === day);

  const places = [...new Set(schedules.map((item) => item.place))];

  area.innerHTML = `
    <div class="timetable-wrap">
      <div class="place-column">
        <div class="place-header">場所</div>
        ${places.map((place) => `<div class="place-cell">${place}</div>`).join("")}
      </div>

      <div class="time-scroll">
        <div class="time-table" style="width: ${getTableWidth()}px;">
          <div class="time-header">
            ${createTimeHeader()}
          </div>

          <div class="schedule-area" style="height: ${places.length * rowHeight}px;">
            ${createVerticalLines()}
            ${createScheduleRows(places)}
            ${schedules.map((schedule) => createScheduleBlock(schedule, places)).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTableWidth() {
  return (endHour - startHour) * hourWidth + leftPadding;
}

function createTimeHeader() {
  let html = "";

  for (let hour = startHour; hour <= endHour; hour++) {
    html += `
      <div class="time-label" style="left: ${leftPadding + (hour - startHour) * hourWidth}px;">
        ${hour}:00
      </div>
    `;
  }

  return html;
}

function createVerticalLines() {
  let html = "";

  for (let hour = startHour; hour <= endHour; hour++) {
    html += `
      <div class="vertical-line" style="left: ${leftPadding + (hour - startHour) * hourWidth}px;"></div>
    `;
  }

  return html;
}

function createScheduleRows(places) {
  return places.map((place, index) => {
    return `
      <div class="schedule-row" style="top: ${index * rowHeight}px;"></div>
    `;
  }).join("");
}

function createScheduleBlock(schedule, places) {
  const event = allEvents.find((item) => item.id === schedule.eventId);

  if (!event) {
    return "";
  }

  const placeIndex = places.indexOf(schedule.place);

  const left = timeToLeft(schedule.start);
  const width = timeToLeft(schedule.end) - left;
  const top = placeIndex * rowHeight + 10;

  return `
    <a
      href="event-detail.html?id=${event.id}"
      class="schedule-block"
      style="left: ${left}px; top: ${top}px; width: ${width}px;"
    >
      <span class="schedule-time">${schedule.start} - ${schedule.end}</span>
      <span class="schedule-title">${event.group}</span>
    </a>
  `;
}

function timeToLeft(time) {
  const [hour, minute] = time.split(":").map(Number);
  return leftPadding + ((hour - startHour) * hourWidth) + (minute / 60) * hourWidth;
}