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