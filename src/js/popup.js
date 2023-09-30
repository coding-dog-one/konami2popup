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

// ライト/ダークテーマに応じて色を変える
const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
document.body.dataset.bsTheme = theme;
