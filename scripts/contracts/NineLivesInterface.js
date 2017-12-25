let NINE_LIVES_CONTRACT_ADDRESS = '0xd3b61a9bfe51b1729c1d0ecfdf9318576d93edef';

let NineLivesABI = web3.eth.contract([
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
			}
		],
		"name": "spawnKitty",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]);

var NineLives = NineLivesABI.at(NINE_LIVES_CONTRACT_ADDRESS);
