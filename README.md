# Before you start
1. Ensure you have node and npm installed
2. Install Ethereumjs-testrpc `npm install -g ethereumjs-testrpc`
3. Run Ethereum TestRPC client `testrpc`
4. Since the test network is running locally, this means you'll have to deploy our test contracts everytime the network is created again. 

# How do I deploy contracts to my test node?
You can easily deploy your contract straight from the [Remix IDE](remix.ethereum.org). 
In the Run tab, change the environment dropdown to Web3 Provider, hit ok, then specify the testrpc localhost address as the endpoint, default `http://localhost:8545`

After deploying the test contracts, make sure to update the contract address in the code. Unfortunately contracts cannot be deployed to a specific address, so a new address is created everytime it's deployed.

More information at https://coursetro.com/posts/code/99/Interacting-with-a-Smart-Contract-through-Web3.js-(Tutorial)

# How to install this extension?
1. Clone this repository
2. Open Google Chrome, navigate to `Chrome => Preferences => Extensions` or enter `chrome://extensions` in the url
3. Enable **Developer Mode**
4. Click on `Load unpacked extension` and select the root of this repository
