let KRYPTO_KITTIES_CONTRACT_ADDRESS = '0x39df7d0aa6e025c9d64d5919279ab6c62ca8126e';

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

var KryptoKitties = KryptoKittiesABI.at(KRYPTO_KITTIES_CONTRACT_ADDRESS);
