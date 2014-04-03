function closeTab() {
    chrome.tabs.getCurrent(function(tab) {
        if (tab) {
            chrome.tabs.remove(tab.id);
        }
    });
}

Trello.authorize({interactive: false, persist: true});
if (Trello.authorized()) {
    closeTab();
} else if (window.location.hash === "#token=") {
    chrome.browserAction.setBadgeText({text: "!"});
    closeTab();
} else {
    Trello.authorize({
        name: "Treble",
        type: "redirect",
        scope: {
            write: true
        }
    });
}
