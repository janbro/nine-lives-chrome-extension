function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];

    //Tell content script to grab kitties on current page
    chrome.tabs.sendMessage(activeTab.id, {"message": "GET_KITTY_INFO"});
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("get-kitty-info").addEventListener("click", popup);
});