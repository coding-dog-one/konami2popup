const _width = 525;
const _height = 750;

// メッセージ受信時に実行する処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received: ", message);

  if (message.action === "setSize") {
    const width = message.width || _width;
    const height = message.height || _height;

    // コンテキストメニューを更新
    chrome.contextMenus.update("popthis", {
      title: chrome.i18n.getMessage("context_popthis", [width, height]),
    });

    // サイズ設定をローカルストレージに保存
    saveSize(width, height);
    return true; // Indicates that the response will be sent asynchronously
  }

  if (message.action === "getSize") {
    // サイズ設定をローカルストレージから読み込む
    loadSize().then((size) => {
      sendResponse(size);
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

// インストール時に実行する処理
chrome.runtime.onInstalled.addListener(function (details) {
  // コンテキストメニューを作成
  loadSize().then((size) => {
    chrome.contextMenus.create({
      id: "popthis",
      title: chrome.i18n.getMessage("context_popthis", [
        size.width,
        size.height,
      ]),
      contexts: ["all"],
    });
  });
});

// コンテキストメニュー押下時に実行する処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "popthis") {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      chrome.runtime.sendMessage({ action: "getSize" }).then((resp) => {
        window.open(
          window.location.href,
          "_blank",
          `location=yes,width=${resp.width},height=${resp.height},resizable=yes,scrollbars=yes`
        );
      });
    },
  });
});

function loadSize() {
  return chrome.storage.local.get(["width", "height"]).then((result) => {
    console.log("Got values from local storage: ", result);

    const width = result.width || _width;
    const height = result.height || _height;
    const ret = { width: width, height: height };
    console.log("Return: ", ret);

    return ret;
  });
}

function saveSize(width, height) {
  const values = { width: width, height: height };
  console.log("Save values into local storage: ", values);
  chrome.storage.local.set(values);
}
