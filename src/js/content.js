// 開いているWebサイトに直接作用できるJS

// コナミコマンドのキーのシーケンス
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];
let currentPos = 0;

// キー入力を監視するイベントリスナー
window.addEventListener("keydown", (e) => {
  // 入力されたキーがコナミコマンドの次のキーと一致するかどうかを確認
  if (e.code !== konamiCode[currentPos]) {
    // 一致しない場合、位置をリセット
    currentPos = 0;
    return;
  }

  // 一致する場合、コナミコマンドのシーケンス内での位置を進める
  currentPos++;
  console.log(konamiCode[currentPos - 1]);
  if (currentPos === konamiCode.length) {
    // コナミコマンドのシーケンスが完了した場合、ページをポップアップする
    console.log("pop up!");
    chrome.runtime.sendMessage({ action: "getSize" }).then((resp) => {
      window.open(
        window.location.href,
        "_blank",
        `location=yes,width=${resp.width},height=${resp.height},resizable=yes,scrollbars=yes`
      );
    });
    // 位置をリセット
    currentPos = 0;
  }
});
