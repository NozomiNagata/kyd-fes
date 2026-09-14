"use strict";

async function showEvent() {
  const detailArea = document.getElementById("event-detail");

  // URLの「?id=pc」からpcを取得
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    detailArea.innerHTML = `
      <h2>企画が指定されていません</h2>
      <p>企画一覧から選択してください。</p>
    `;
    return;
  }

  try {
    // JSONファイルを読み込む
    const response = await fetch("data/events.json");

    if (!response.ok) {
      throw new Error("企画データを読み込めませんでした。");
    }

    const events = await response.json();

    // URLのidと一致する企画を探す
    const event = events.find((item) => item.id === eventId);

    if (!event) {
      detailArea.innerHTML = `
        <h2>企画が見つかりません</h2>
        <p>指定された企画は登録されていません。</p>
      `;
      return;
    }

    // 見つかった企画を画面に表示
    detailArea.innerHTML = `
      <h2>${event.name}</h2>

      <img
        src="${event.image}"
        alt="${event.name}"
        class="event-image"
      >

    <dl class="event-information">
      <div class="event-info-row">
        <span class="event-info-item">
          <i class="fa-solid fa-users"></i>
          <span>${event.group}</span>
        </span>

        <span class="event-info-item">
          <i class="fa-solid fa-location-dot"></i>
          <span>${event.floor} ${event.room}</span>
        </span>

        <span class="event-info-item">
          <i class="fa-solid fa-tag"></i>
          <span>${event.tag}</span>
        </span>
      </div>
    </dl>

      <p>${event.description}</p>

      ${event.note ? `<p class="event-note"> ${event.note}</p>` : ""}

      <p>
        <a href="map.html">校内マップを見る</a>
      </p>
    `;

    document.title =
      `${event.name}｜東京都立小山台高校 寒菊祭`;

  } catch (error) {
    console.error(error);

    detailArea.innerHTML = `
      <h2>読み込みエラー</h2>
      <p>企画情報を読み込めませんでした。</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", showEvent);