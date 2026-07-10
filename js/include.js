document.addEventListener("DOMContentLoaded", async function () {
  await includeHTML("header", "parts/header.html");
  await includeHTML("footer", "parts/footer.html");

  const script = document.createElement("script");
  script.src = "js/main.js";
  document.body.appendChild(script);
});

async function includeHTML(id, filePath) {
  const place = document.getElementById(id);

  if (!place) {
    console.error(id + " という場所が見つかりません");
    return;
  }

  const response = await fetch(filePath);

  if (!response.ok) {
    console.error(filePath + " を読み込めませんでした");
    return;
  }

  const html = await response.text();
  place.innerHTML = html;
}