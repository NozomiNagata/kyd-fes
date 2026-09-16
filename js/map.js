// 各階のSVG
const maps = [
  document.getElementById("map_1f"),
  document.getElementById("map_2f"),
  document.getElementById("map_3f"),
  document.getElementById("map_4f")
];

// SVGが読み込まれるのを待つ
function waitForSvg(map) {
  return new Promise((resolve) => {

    const loaded = () => {
      const svg = map.contentDocument;

      if (
        svg &&
        svg.documentElement &&
        svg.documentElement.localName === "svg"
      ) {
        resolve(svg);
      }
    };

    // ★先にloadイベントを登録する
    map.addEventListener("load", loaded, { once: true });

    // ★すでに読み込み済みだった場合にも対応
    loaded();
  });
}


// events.jsonを読み込む
const eventsPromise = fetch("data/events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("events.json の読み込みに失敗しました");
    }

    return response.json();
  });


// events.json と4枚のSVGが全部そろうまで待つ
Promise.all([
  eventsPromise,
  ...maps.map(waitForSvg)
])
  .then(([events, ...svgs]) => {

    // 各階をチェック
    svgs.forEach((svg) => {

      // JSONにある企画を全部チェック
      events.forEach((event) => {

        // roomIdと同じidの部屋を探す
        const room = svg.getElementById(event.roomId);

        if (!room) {
          return;
        }

        // 指カーソルにする
        room.style.cursor = "pointer";

        // クリック処理
        room.addEventListener("click", () => {

          // 体育館だけタイムテーブルへ
          if (event.roomId === "room_gym") {
            window.location.href = "timetable.html";
            return;
          }

          // その他は企画詳細へ
          window.location.href =
            `event-detail.html?id=${event.id}`;
        });

      });

    });

    console.log("マップのクリック設定完了");

  })
  .catch((error) => {
    console.error("マップの設定中にエラー:", error);
  });