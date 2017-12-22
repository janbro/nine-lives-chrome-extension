console.log("Nine Lives");


let baseAccessory = document.createElement("IMG");
baseAccessory.className = "KittyCard-image";
baseAccessory.style.zIndex = 2;

let headBandage = baseAccessory.cloneNode();
let legBandage = baseAccessory.cloneNode();
let eyeBruise = baseAccessory.cloneNode();
let bandaid = baseAccessory.cloneNode();

headBandage.src = chrome.extension.getURL("./svg/kitty_accessories/head_bandage.svg");
legBandage.src = chrome.extension.getURL("./svg/kitty_accessories/leg_bandage.svg");
eyeBruise.src = chrome.extension.getURL("./svg/kitty_accessories/eye_bruise.svg");
bandaid.src = chrome.extension.getURL("./svg/kitty_accessories/bandaid.svg");

let kittyAccessories = [
    headBandage,
    legBandage,
    eyeBruise,
    bandaid
];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "GET_KITTY_INFO" ) {
            //Select all kitty items and extract kitty id
            document.querySelectorAll(".KittiesGrid-item").forEach((div, index, array) => {
                let kittyId = /\/\d*$/g.exec(div.childNodes[0].href)[0].substr(1);

                //Send kitty ids to background script
                chrome.runtime.sendMessage({"message": "GET_KITTY", "kittyId": kittyId}, (response) => {
                    console.log(response);
                    div.childNodes[0].childNodes[0].childNodes[0].appendChild(kittyAccessories[BigNumber(response.result.birthTime.slice(-1)).modulo(kittyAccessories.length).toNumber()].cloneNode());
                });
            });
        }
        return true;
    }
);