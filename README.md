# Before you start
1. Ensure you have node and npm installed
2. Install Ethereumjs-testrpc `npm install -g ethereumjs-testrpc`
3. Run Ethereum TestRPC client `testrpc`
4. Since the network is running locally, this means you'll have to deploy our test contracts everytime the network is created again. 

# How do I deploy contracts to my test node?
You can easily deploy your contract straight from the [Remix IDE](remix.ethereum.org). 
In the Run tab, change the environment dropdown to Web3 Provider, hit ok, then specify the testrpc localhost address as the endpoint, default `http://localhost:8545`

Before deploying the test contracts, check the contract address listed in the code to deploy at. E.g. our test contract for CryptoKitties is at `0x3d737a47f859f36a3408b8327e72674c257cd88a`. This will save you time in not having to change the contract address in the code everytime your contract is redeployed.

More information at https://coursetro.com/posts/code/99/Interacting-with-a-Smart-Contract-through-Web3.js-(Tutorial)

# How to install this extension?
1. Checkout this repository
2. Open Google Chrome, navigate to `Chrome => Preferences => Extensions` or `chrome://extensions`
3. Enable **Developer Mode**
4. Click on `Load unpacked extension` and select the root of this repository
