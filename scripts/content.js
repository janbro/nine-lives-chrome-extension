console.log("Nine Lives");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "GET_KITTY_INFO" ) {
            //Select all kitty items and extract kitty id
            document.querySelectorAll(".KittiesGrid-item").forEach((div, index, array) => {
                let kittyId = /\/\d*$/g.exec(div.childNodes[0].href)[0].substr(1);

                //Send kitty ids to background script
                chrome.runtime.sendMessage({"message": "GET_KITTY", "kittyId": kittyId}, processKittyInfo);
            });
        }
    }
);

function processKittyInfo(response) {
    console.log(response);
}

