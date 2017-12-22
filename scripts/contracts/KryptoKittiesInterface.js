let CONTRACT_ADDRESS = '0x3d737a47f859f36a3408b8327e72674c257cd88a';
let LOCAL_HTTP_PROVIDER = "http://localhost:8545";

var web3 = new Web3();

//Force provider to use local ethereum node

/* if (typeof web3 !== 'undefined') {
     web3 = new Web3(web3.currentProvider);
 } else {
    // set the provider you want from Web3.providers */
    web3 = new Web3(new Web3.providers.HttpProvider(LOCAL_HTTP_PROVIDER));
/* } */

web3.eth.defaultAccount = web3.eth.accounts[0]; //Testing purposes

let KryptoKittiesABI = web3.eth.contract([
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "kitties",
		"outputs": [
			{
				"name": "genes",
				"type": "uint256"
			},
			{
				"name": "birthTime",
				"type": "uint64"
			},
			{
				"name": "cooldownEndBlock",
				"type": "uint64"
			},
			{
				"name": "matronId",
				"type": "uint32"
			},
			{
				"name": "sireId",
				"type": "uint32"
			},
			{
				"name": "siringWithId",
				"type": "uint32"
			},
			{
				"name": "cooldownIndex",
				"type": "uint16"
			},
			{
				"name": "generation",
				"type": "uint16"
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
				"name": "_seed",
				"type": "string"
			}
		],
		"name": "createKitty",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]);

var KryptoKitties = KryptoKittiesABI.at(CONTRACT_ADDRESS);
