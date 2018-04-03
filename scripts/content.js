console.log("Nine Lives");

let baseAccessory = document.createElement("IMG");
baseAccessory.style.zIndex = 2;

let fire = document.createElement("canvas");
fire.className = 'fire';
fire.style.zIndex = 3;

let baseHeart = baseAccessory.cloneNode();
baseHeart.style.width = '10%';
baseHeart.style.display = 'inline-grid';
baseHeart.style.position = 'relative';

let headBandage = baseAccessory.cloneNode();
let legBandage = baseAccessory.cloneNode();
let eyeBruise = baseAccessory.cloneNode();
let bandaid = baseAccessory.cloneNode();
let damageAccessories = [bandaid, legBandage, eyeBruise, headBandage];
let tombstone = baseAccessory.cloneNode();
let heart = baseHeart.cloneNode();
let heartGrey = baseHeart.cloneNode();

headBandage.src = chrome.extension.getURL("./svg/kitty_accessories/head_bandage.svg");
legBandage.src = chrome.extension.getURL("./svg/kitty_accessories/leg_bandage.svg");
eyeBruise.src = chrome.extension.getURL("./svg/kitty_accessories/eye_bruise.svg");
bandaid.src = chrome.extension.getURL("./svg/kitty_accessories/bandaid.svg");
tombstone.src = chrome.extension.getURL("./svg/tombstone.svg");
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
    else if(request.message === "WEB3") {
        sendResponse(web3);
    }
});

window.addEventListener("message", function(event) {
    if (event.data.type && (event.data.type == "KITTY_INFO_OBJECT")) {
        renderBattle(event.data.kittyDOM, event.data.kittyInfo);
    }
    if (event.data.type && (event.data.type == "SPAWNED_KITTY")) {
        window.location.reload(false);
    }
}, false);

let kittiesContent = [];

function renderAccessories() {
    if(document.querySelector(".KittiesGrid-item") == undefined && document.querySelector(".KittyBanner-container") == undefined) {
        //Didn't find any kitties on the page
        return false;
    }

    document.querySelectorAll(".KittiesGrid-item").forEach((div, index, array) => {
        let kittyId = /\/\d*$/g.exec(div.childNodes[0].href)[0].substr(1);
        let kittyDOM = {
            kittyId: kittyId,
            index: index,
            isGridItem: true
        };

        kittiesContent.push({parent: div, container: div.childNodes[0].childNodes[0].childNodes[0]});

        window.postMessage({ type: "GET_KITTY_INFO", kittyDOM: JSON.stringify(kittyDOM) }, "*");
        
    });

    //KittyBanner-container
    //Single kitty page
    document.querySelectorAll(".KittyBanner-container").forEach((div, index, array) => {
        let kittyId = /\/\d*$/g.exec(div.childNodes[0].href)[0].substr(1);

        let kittyDOM = {
            kittyId: kittyId,
            index: index,
            isGridItem: false
        };

        kittiesContent.push({parent: div, container: div});

        window.postMessage({ type: "GET_KITTY_INFO", kittyDOM: JSON.stringify(kittyDOM) }, "*");
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
    
    for(let i=1; i <= 9; i++) {
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
    
    for(let i=1; i <= 9; i++) {
        if(i < livesRemaining) {
            heartsContainer.appendChild(heart.cloneNode());
        }
        else {
            heartsContainer.appendChild(heartGrey.cloneNode());
        }
    }

    return heartsContainer;
}

function renderBattle(kittyDOM, kittyInfo) {
    let div = kittiesContent[kittyDOM.index].parent;
    let container = kittiesContent[kittyDOM.index].container;

    if(kittyInfo.lives === 0 && !kittyDOM.isGridItem && kittyInfo.isOwner) {
        let spawnKittyButton = document.createElement("BUTTON");
        spawnKittyButton.className = 'Button Button--love';
        spawnKittyButton.innerHTML = 'Spawn Kitty';
        spawnKittyButton.style.position = 'absolute';
        spawnKittyButton.style.right = '0px';
        spawnKittyButton.style.bottom = '5%';

        spawnKittyButton.onclick = function() {
            window.postMessage({ type: "SPAWN_KITTY", kittyId: kittyDOM.kittyId }, "*");
        }

        div.appendChild(spawnKittyButton);
    }
    else if (kittyInfo.lives > 1) {
        if(kittyDOM.isGridItem) {
            container.appendChild(renderGridHearts(kittyInfo.lives));

            if(kittyInfo.lives === 1) {
                //Kitty is dead
                container.removeChild(container.childNodes[0]);
                tombstone.className = "KittyCard-image";
                container.appendChild(tombstone.cloneNode());
            }
            else {
                //Render battle stuff
                if(kittyInfo.lives === 1 < 10) {
                    let accessories = [];
                    kittyAccessories.slice(0, int(kittyInfo.lives / 2)).forEach(function(accessory, ind) {
                        accessories[ind] = accessory.cloneNode();
                        accessories[ind].className = "KittyCard-image";
                        accessories[ind].style.position = "absolute";
                        container.appendChild(accessories, ind);
                    });
                }

                if(kittyInfo.isReadyToBattle) {
                    fire.className += ' KittyCard-image';
                    fire.style.left = '40%';
                    fire.style.top = '10%';
                    container.appendChild(fire.cloneNode());
                    fire.style.left = '56%';
                    container.appendChild(fire.cloneNode());

                    console.log($(container).css('background-color'));

                    loadFire();
                }
            }
        }
        else {
            container.appendChild(renderPageHearts(kittyInfo.lives));

            if(kittyInfo.lives === 1) {
                //Kitty is dead
                container.removeChild(container.childNodes[0]);
                tombstone.className = "KittyBanner-image";
                container.appendChild(tombstone.cloneNode());
            }
            else if (kittyInfo.lives > 1) {
                let accessories = [];
                kittyAccessories.slice(0, 5 - Math.ceil(kittyInfo.lives / 2)).forEach(function(accessory, ind) {
                    accessories[ind] = accessory.cloneNode();
                    accessories[ind].className = "KittyBanner-image";
                    accessories[ind].style.position = "absolute";
                    container.appendChild(accessories[ind]);
                });

                if(kittyInfo.isReadyToBattle && !kittyInfo.isOwner) {
                    let battleButton = document.createElement("BUTTON");
                    battleButton.className = 'Button Button--love';
                    battleButton.innerHTML = 'Battle';
                    battleButton.style.position = 'absolute';
                    battleButton.style.right = '0px';
                    battleButton.style.bottom = '5%';
                    
                    container.appendChild(battleButton);
                }
                else if(!kittyInfo.isReadyToBattle) {
                    let battleButton = document.createElement("BUTTON");
                    battleButton.className = 'Button Button--love';
                    battleButton.innerHTML = 'Send To Arena';
                    battleButton.style.position = 'absolute';
                    battleButton.style.right = '0px';
                    battleButton.style.bottom = '5%';

                    battleButton.onclick = function() {
                        window.postMessage({ type: "SEND_KITTY_READY_TO_BATTLE", kittyId: kittyDOM.kittyId }, "*");
                    }

                    container.appendChild(battleButton);
                }
            }
        }
    }
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