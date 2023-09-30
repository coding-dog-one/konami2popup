// 拡張機能のポップアップウィンドウに作用できるJS

document.getElementById("setSize").addEventListener("click", () => {
  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  const message = {
    action: "setSize",
    width: width,
    height: height,
  };
  console.log("Send message: ", message);
  chrome.runtime.sendMessage(message);
});

chrome.runtime.sendMessage({ action: "getSize" }).then((resp) => {
  console.log("Response: ", resp);
  document.getElementById("width").value = resp.width;
  document.getElementById("height").value = resp.height;
});

setThemeColor();
localizeHtmlPage();

function setThemeColor() {
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  // <body>のdata-bs-themeが"dark"ならダークテーマ、"light"ならライトテーマになる
  // https://getbootstrap.com/docs/5.3/customize/color-modes/#dark-mode
  document.body.dataset.bsTheme = theme;
}

function localizeHtmlPage() {
  // https://stackoverflow.com/a/56429696
  document.querySelectorAll("[data-locale]").forEach((elem) => {
    elem.innerText = chrome.i18n.getMessage(elem.dataset.locale);
  });
}
