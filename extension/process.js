browser.browserAction.onClicked.addListener((tab) => {
    let port = browser.tabs.connect(tab.id, {
        name: "establish_connection"
    });

    port.postMessage({
        action: "showStatus"
    });
})
