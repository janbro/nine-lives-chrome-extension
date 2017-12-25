console.log("Nine Lives");


let baseAccessory = document.createElement("IMG");
baseAccessory.style.zIndex = 2;

let baseHeart = baseAccessory.cloneNode();
baseHeart.style.width = '10%';
baseHeart.style.display = 'inline-grid';
baseHeart.style.position = 'relative';

let headBandage = baseAccessory.cloneNode();
let legBandage = baseAccessory.cloneNode();
let eyeBruise = baseAccessory.cloneNode();
let bandaid = baseAccessory.cloneNode();
let heart = baseHeart.cloneNode();
let heartGrey = baseHeart.cloneNode();

headBandage.src = chrome.extension.getURL("./svg/kitty_accessories/head_bandage.svg");
legBandage.src = chrome.extension.getURL("./svg/kitty_accessories/leg_bandage.svg");
eyeBruise.src = chrome.extension.getURL("./svg/kitty_accessories/eye_bruise.svg");
bandaid.src = chrome.extension.getURL("./svg/kitty_accessories/bandaid.svg");
heart.src = chrome.extension.getURL("./svg/heartPinkLargest.svg");
heartGrey.src = chrome.extension.getURL("./svg/heartPinkLargest-grey.svg");

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

            chrome.runtime.sendMessage({"message": "GET_KITTY_LIVES", "kittyId": kittyId}, (response) => {
                console.log(response);
                div.childNodes[0].childNodes[0].childNodes[0].appendChild(renderGridHearts(response.result));
            });
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
            
            chrome.runtime.sendMessage({"message": "GET_KITTY_LIVES", "kittyId": kittyId}, (response) => {
                div.appendChild(renderPageHearts(response.result));
            });
        });
    });

    return true;
}

function renderGridHearts(livesRemaining) {
    let heartsContainer = document.createElement("div");
    heartsContainer.style.width = '100%';
    heartsContainer.style.height = 'auto';
    heartsContainer.style.top = '90%';
    heartsContainer.style.left = '50%';
    heartsContainer.style.marginLeft = '5px';
    heartsContainer.className = 'KittyCard-image';
    
    for(let i=0; i < 9; i++) {
        if(i < livesRemaining) {
            heartsContainer.appendChild(heart.cloneNode());
        }
        else {
            heartsContainer.appendChild(heartGrey.cloneNode());
        }
    }

    return heartsContainer;
}

function renderPageHearts(livesRemaining) {
    let heartsContainer = document.createElement("div");
    heartsContainer.style.height = 'auto';
    heartsContainer.style.top = '85%';
    heartsContainer.style.left = '1%';
    heartsContainer.style.marginLeft = '5px';
    heartsContainer.style.position = 'absolute';
    heartsContainer.className = 'KittyCard-image';
    
    for(let i=0; i < 9; i++) {
        if(i < livesRemaining) {
            heartsContainer.appendChild(heart.cloneNode());
        }
        else {
            heartsContainer.appendChild(heartGrey.cloneNode());
        }
    }

    return heartsContainer;
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