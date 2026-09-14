// 企画データを読み込む
fetch("data/events.json")
  .then((response) => response.json())
  .then((events) => {

    // 各階のSVG
    const maps = [
      document.getElementById("map_1f"),
      document.getElementById("map_2f"),
      document.getElementById("map_3f"),
      document.getElementById("map_4f")
    ];

    maps.forEach((map) => {

      map.addEventListener("load", () => {

        // その階のSVGの中身
        const svg = map.contentDocument;

        // JSONにある企画を全部チェック
        events.forEach((event) => {

          // roomIdと同じidの部屋をSVGから探す
          const room = svg.getElementById(event.roomId);

          // この階にその部屋がなければ何もしない
          if (!room) {
            return;
          }

          // クリックできることが分かるようにする
          room.style.cursor = "pointer";

          // クリックしたらその企画詳細へ
          room.addEventListener("click", () => {

            if (event.roomId === "room_gym") {
              window.location.href = "timetable.html";
              return;
            }
            
            window.location.href =
              `event-detail.html?id=${event.id}`;
          });

        });

      });

    });

  });