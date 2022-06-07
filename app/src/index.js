import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.", error);
    }
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function () {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({ from: this.account });
    App.setStatus("New Star Owner is " + this.account + ".");
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function () {
    const tokenId = document.getElementById("lookid").value;
    const { lookUptokenIdToStarInfo } = this.meta.methods;
    const result = await lookUptokenIdToStarInfo(tokenId).call();
    const message = result
      ? "The star name is " + result
      : "There is no star with id " + tokenId;
    App.setStatus(message);
  },

  exchangeStars: async function () {
    try {
      const { exchangeStars } = this.meta.methods;
      const starOneId = document.getElementById("exStarId1").value;
      const starTwoId = document.getElementById("exStarId2").value;
      await exchangeStars(starOneId, starTwoId).send({ from: this.account });
      App.setStatus("Exchange successfully completed");
    } catch (error) {
      App.setStatus(error.message);
    }
  },

  transferStar: async function () {
    try {
      const { transferStar } = this.meta.methods;
      const starId = document.getElementById("starid").value;
      const toAccount = document.getElementById("transfToAccount").value;
      await transferStar(toAccount, starId).send({ from: this.account });
      App.setStatus("Transfer successfully completed");
    } catch (error) {
      App.setStatus(error.message);
    }
  },
};

window.App = App;

window.addEventListener("load", async function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545")
    );
  }

  App.start();
});
