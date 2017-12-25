chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "GET_KITTY" ) {
            //Get kitty info from contract
            KryptoKitties.getKitty(request.kittyId, function(error, result) {
                if(error) {
                    console.log(error);
                }
                else {
                    let kittyInfo = new KittyInfo(result[0], result[1], result[2].toJSON(), result[3].toJSON(), result[4].toJSON(), result[5].toJSON(), result[6].toJSON(), result[7].toJSON(), result[8].toJSON(), result[9].toJSON());
                    sendResponse({result: kittyInfo});
                }
            });
        }
        else if( request.message === "GET_KITTY_LIVES" ) {
            //Get kitty info from contract
            NineLives.getKittyLives(request.kittyId, function(error, result) {
                if(error) {
                    console.log(error);
                }
                else {
                    let lives = result.toNumber();
                    if(lives === 0) {
                        return false;
                    }
                    sendResponse({result: lives});
                }
            });
        }
        return true;
    }
);

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if(changeInfo.url){
            chrome.tabs.sendMessage(tabId, {"message": "POLL_KITTIES"});
        }
    }
);