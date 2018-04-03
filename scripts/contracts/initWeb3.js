var script = document.createElement('script');
script.appendChild(document.createTextNode(initArena + initKCore + initNineLives + '(' + initWeb3 +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

function initWeb3(NineLives, KryptoKitties ) {
    let NINE_LIVES_CONTRACT_ADDRESS = '0x37d5e18c86d84c4407c0fcbde32492e7ffbbc05f';
    let ARENA_CONTRACT_ADDRESS = '0x37d5e18c86d84c4407c0fcbde32492e7ffbbc05f';
    let KRYPTO_KITTIES_CONTRACT_ADDRESS = '0xc284f4f97c0bf96de244b28829c1e092c165a6f5';

    let LOCAL_HTTP_PROVIDER = "http://localhost:8545";

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
       // set the provider you want from Web3.providers 
       web3 = new Web3(new Web3.providers.HttpProvider(LOCAL_HTTP_PROVIDER));
    }

    var NineLives = initNineLives(NINE_LIVES_CONTRACT_ADDRESS);
    var Arena = initArena(ARENA_CONTRACT_ADDRESS);
    var KryptoKitties = initKCore(KRYPTO_KITTIES_CONTRACT_ADDRESS);

    window.addEventListener("message", function(event) {
        // We only accept messages from ourselves
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type == "SPAWN_KITTY")) {
            NineLives.spawnKitty(event.data.kittyId, {from:web3.eth.defaultAccount}, function(error, result) {
                if(error) {
                    console.log(error);
                    event.source.postMessage({ type: "ERROR", error: error }, event.origin);
                }
                else {
                    event.source.postMessage({type: "SPAWNED_KITTY", kittyId: kittyId}, event.origin);
                }
            });
        }
        else if (event.data.type && (event.data.type == "SEND_KITTY_READY_TO_BATTLE")) {
            console.log(event.data);
            Arena.sendKittyReadyToBattle(event.data.kittyId, {from:web3.eth.defaultAccount}, function(error, result) {
                if(error) {
                    console.log(error);
                    event.source.postMessage({ type: "ERROR", error: error }, event.origin);
                }
                else {
                    event.source.postMessage({type: "SENT_KITTY_READY_TO_BATTLE", kittyId: event.data.kittyId}, event.origin);
                }
            });
        }
        else if (event.data.type && (event.data.type == "GET_KITTY_INFO")) {
            event.data.kittyDOM = JSON.parse(event.data.kittyDOM);

            KryptoKitties.ownerOf(event.data.kittyDOM.kittyId, function(error, result) {
                let owner = result;

                NineLives.getKittyInfo(event.data.kittyDOM.kittyId, function(error, result) {
                    if(error) {
                        console.log(error);
                        event.source.postMessage({ type: "ERROR", error: error }, event.origin);
                    }
                    else {
                        let lives = result[0].toNumber();
    
                        let kitty = {
                            lives: lives,
                            isReadyToBattle: result[1],
                            owner: owner,
                            isOwner: owner == web3.eth.defaultAccount
                        }
                        event.source.postMessage({ type: "KITTY_INFO_OBJECT", kittyDOM: event.data.kittyDOM, kittyInfo: kitty }, event.origin);
                    }
                });
            });
        }
    }, false);
}

function initNineLives(NINE_LIVES_CONTRACT_ADDRESS) {

    let NineLivesABI = web3.eth.contract([
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "isReadyToBattle",
            "outputs": [
                {
                    "name": "isReady",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getKittyLives",
            "outputs": [
                {
                    "name": "lives",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getKittyInfo",
            "outputs": [
                {
                    "name": "lives",
                    "type": "uint8"
                },
                {
                    "name": "isReadyToBattle",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "decrementLives",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "name": "_isReadyToBattle",
                    "type": "bool"
                }
            ],
            "name": "setReadyToBattle",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "spawnKitty",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]);

    return NineLivesABI.at(NINE_LIVES_CONTRACT_ADDRESS);
}

function initArena(ARENA_CONTRACT_ADDRESS) {

    let ArenaABI = web3.eth.contract([
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "rewards",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "withdrawKitty",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                },
                {
                    "name": "_kittyToBattle",
                    "type": "uint256"
                }
            ],
            "name": "sendKittyToBattle",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_tokenAddress",
                    "type": "address"
                }
            ],
            "name": "addTokenAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "paused",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "sendKittyReadyToBattle",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "tokenAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "kittyIndexToOwner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_battleAddress",
                    "type": "address"
                }
            ],
            "name": "updateBattleContract",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "withdrawRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "ckAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "rescueKitty",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_nineLivesAddress",
                    "type": "address"
                },
                {
                    "name": "_battleAddress",
                    "type": "address"
                },
                {
                    "name": "_kCore",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_kittyWinner",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "_kittyLoser",
                    "type": "uint256"
                }
            ],
            "name": "LogBattleResult",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "LogKittyReadyToBattle",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_kittyIdAttacker",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "_kittyIdDefender",
                    "type": "uint256"
                }
            ],
            "name": "LogKittyBattle",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "LogKittyWithdraw",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_battleAddress",
                    "type": "address"
                }
            ],
            "name": "LogUpdateBattleContract",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "Pause",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "Unpause",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        }
    ]);

    return  ArenaABI.at(ARENA_CONTRACT_ADDRESS);
}

function initKCore(KRYPTO_KITTIES_CONTRACT_ADDRESS) {

    class KittyInfo  {
        constructor(_isGestating, _isReady, _cooldownIndex, _nextAuctionAt, _siringWithId, _birthTime, _matronId, _sireId, _generation, _genes) {
            this.genes = _genes;
            this.birthTime = _birthTime;
            this.cooldownEndBlock = _nextAuctionAt;
            this.matronId = _matronId;
            this.sireId = _sireId;
            this.siringWithId = _siringWithId;
            this.cooldownIndex = _cooldownIndex;
            this.generation = _generation;
            this.isGestating = _isGestating;
            this.isReady = _isReady;
        }
    }

    let KryptoKittiesABI = web3.eth.contract([
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_interfaceID",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "cfoAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_tokenId",
                    "type": "uint256"
                },
                {
                    "name": "_preferredTransport",
                    "type": "string"
                }
            ],
            "name": "tokenMetadata",
            "outputs": [
                {
                    "name": "infoUrl",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "promoCreatedCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "ceoAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "GEN0_STARTING_PRICE",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "setSiringAuctionAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "pregnantKitties",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "isPregnant",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "GEN0_AUCTION_DURATION",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "siringAuction",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "setGeneScienceAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_newCEO",
                    "type": "address"
                }
            ],
            "name": "setCEO",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_newCOO",
                    "type": "address"
                }
            ],
            "name": "setCOO",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                },
                {
                    "name": "_startingPrice",
                    "type": "uint256"
                },
                {
                    "name": "_endingPrice",
                    "type": "uint256"
                },
                {
                    "name": "_duration",
                    "type": "uint256"
                }
            ],
            "name": "createSaleAuction",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "sireAllowedToAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_matronId",
                    "type": "uint256"
                },
                {
                    "name": "_sireId",
                    "type": "uint256"
                }
            ],
            "name": "canBreedWith",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "kittyIndexToApproved",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                },
                {
                    "name": "_startingPrice",
                    "type": "uint256"
                },
                {
                    "name": "_endingPrice",
                    "type": "uint256"
                },
                {
                    "name": "_duration",
                    "type": "uint256"
                }
            ],
            "name": "createSiringAuction",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "val",
                    "type": "uint256"
                }
            ],
            "name": "setAutoBirthFee",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_addr",
                    "type": "address"
                },
                {
                    "name": "_sireId",
                    "type": "uint256"
                }
            ],
            "name": "approveSiring",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_newCFO",
                    "type": "address"
                }
            ],
            "name": "setCFO",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_genes",
                    "type": "uint256"
                },
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "createPromoKitty",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "secs",
                    "type": "uint256"
                }
            ],
            "name": "setSecondsPerBlock",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "paused",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "withdrawBalance",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "name": "owner",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "GEN0_CREATION_LIMIT",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "newContractAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "setSaleAuctionAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "count",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_v2Address",
                    "type": "address"
                }
            ],
            "name": "setNewAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "secondsPerBlock",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "tokensOfOwner",
            "outputs": [
                {
                    "name": "ownerTokens",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_matronId",
                    "type": "uint256"
                }
            ],
            "name": "giveBirth",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "withdrawAuctionBalances",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "cooldowns",
            "outputs": [
                {
                    "name": "",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "kittyIndexToOwner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "cooAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "autoBirthFee",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "erc721Metadata",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_genes",
                    "type": "uint256"
                }
            ],
            "name": "createGen0Auction",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_kittyId",
                    "type": "uint256"
                }
            ],
            "name": "isReadyToBreed",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "PROMO_CREATION_LIMIT",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_contractAddress",
                    "type": "address"
                }
            ],
            "name": "setMetadataAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "saleAuction",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getKitty",
            "outputs": [
                {
                    "name": "isGestating",
                    "type": "bool"
                },
                {
                    "name": "isReady",
                    "type": "bool"
                },
                {
                    "name": "cooldownIndex",
                    "type": "uint256"
                },
                {
                    "name": "nextActionAt",
                    "type": "uint256"
                },
                {
                    "name": "siringWithId",
                    "type": "uint256"
                },
                {
                    "name": "birthTime",
                    "type": "uint256"
                },
                {
                    "name": "matronId",
                    "type": "uint256"
                },
                {
                    "name": "sireId",
                    "type": "uint256"
                },
                {
                    "name": "generation",
                    "type": "uint256"
                },
                {
                    "name": "genes",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_sireId",
                    "type": "uint256"
                },
                {
                    "name": "_matronId",
                    "type": "uint256"
                }
            ],
            "name": "bidOnSiringAuction",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "gen0CreatedCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "geneScience",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_matronId",
                    "type": "uint256"
                },
                {
                    "name": "_sireId",
                    "type": "uint256"
                }
            ],
            "name": "breedWithAuto",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "matronId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "sireId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "cooldownEndBlock",
                    "type": "uint256"
                }
            ],
            "name": "Pregnant",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "kittyId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "matronId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "sireId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "genes",
                    "type": "uint256"
                }
            ],
            "name": "Birth",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "newContract",
                    "type": "address"
                }
            ],
            "name": "ContractUpgrade",
            "type": "event"
        }
    ]);

    return KryptoKittiesABI.at(KRYPTO_KITTIES_CONTRACT_ADDRESS);

}