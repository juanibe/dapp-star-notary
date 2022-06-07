const Web3 = require("web3");
const rinkebyNetwork =
  "https://mainnet.infura.io/v3/24f4d963f7034dd3925e0401382afa0c";
const localNetwork = "ws://localhost:9545";
let web3 = new Web3(rinkebyNetwork);
web3.eth.getChainId().then(function (chainId) {
  console.log(chainId);
});
