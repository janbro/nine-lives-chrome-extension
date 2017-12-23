console.log("Nine Lives");


let baseAccessory = document.createElement("IMG");
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

poll(renderAccessories, 10000, 100);

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if( request.message === "GET_KITTY_INFO" ) {
        // Select all kitty items and extract kitty id
        renderAccessories();
    }
    else if( request.message === "POLL_KITTIES") {
        poll(renderAccessories, 10000, 100);
    }
});

function renderAccessories() {
    if(document.querySelector(".KittiesGrid-item") == undefined && document.querySelector(".KittyBanner-container") == undefined) {
        //Didn't find any kitties on the page
        return false;
    }

    document.querySelectorAll(".KittiesGrid-item").forEach((div, index, array) => {
        let kittyId = /\/\d*$/g.exec(div.childNodes[0].href)[0].substr(1);

        //Send kitty ids to background script
        chrome.runtime.sendMessage({"message": "GET_KITTY", "kittyId": kittyId}, (response) => {
            let accessory = kittyAccessories[BigNumber(response.result.birthTime.slice(-1)).modulo(kittyAccessories.length).toNumber()].cloneNode();
            accessory.className = "KittyCard-image";
            accessory.style.position = "absolute";

            div.childNodes[0].childNodes[0].childNodes[0].appendChild(accessory);
        });
    });

    //KittyBanner-container
    document.querySelectorAll(".KittyBanner-container").forEach((div, index, array) => {
        let kittyId = /\/\d*$/g.exec(div.childNodes[0].href)[0].substr(1);

        //Send kitty ids to background script
        chrome.runtime.sendMessage({"message": "GET_KITTY", "kittyId": kittyId}, (response) => {
            let accessoryContainer = document.createElement("a");
            accessoryContainer.style.position = "absolute";

            let accessory = kittyAccessories[BigNumber(response.result.birthTime.slice(-1)).modulo(kittyAccessories.length).toNumber()].cloneNode();
            accessory.className = "KittyBanner-image";
            accessoryContainer.appendChild(accessory);

            div.appendChild(accessoryContainer);
        });
    });

    return true;
}

// The polling function
function poll(fn, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done! 
        var result = fn();
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
}