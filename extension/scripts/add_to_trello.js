chrome.browserAction.setBadgeText({text: ""});
Trello.authorize({interactive: false});
if (!Trello.authorized()) {
    chrome.tabs.create({ url: "authorize.html" });
}

var select = $("SELECT"),
    title = $('[name="title"]');

chrome.tabs.getSelected(function(tab) {
    title.val(tab.title);
    setTimeout(function() {
        title.select().focus();
    }, 50);
});
select.change(function() {
    title.select().focus();
});

function loadBoards(callback) {
    if (localStorage.boards) {
        callback(JSON.parse(localStorage.boards));
    } else {
        Trello.get("members/my/boards", {lists: "open"}, function(boards) {
            localStorage.boards = JSON.stringify(boards);
            callback(boards);
        });
    }
}
loadBoards(function(boards) {
    boards.forEach(function(board) {
        var group = $("<optgroup>", {label: board.name});
        board.lists.forEach(function(list) {
            group.append($("<option>", {value: list.id}).text(list.name));
        });
        select.append(group);
    });
    if (localStorage.currentList) {
        select.val(localStorage.currentList);
    }
});

$("FORM").one("submit", function() {
    localStorage.currentList = select.val();
    Trello.post("lists/" + select.val() + "/cards", {name: title.val()}, function(card) {
        chrome.tabs.getSelected(function(tab) {
            Trello.post("cards/" + card.id + "/attachments", {url: tab.url});
            chrome.tabs.create({ url: card.url });
        });
    });
    return false;
});
