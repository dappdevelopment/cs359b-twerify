function app() {
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
    console.log("Using web3 version: " + Web3.version);
  
    var contract;
    var userAccount;
  
    var contractDataPromise = $.getJSON('ContentToken.json');
    var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
    var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
  
    Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
      .then(function initApp(results) {
        var contractData = results[0];
        var networkId = results[1];

        // TODO: Why is results[1] always 1???
        networkId = 5777
        var accounts = results[2];
        userAccount = accounts[0];

        console.log(contractData)
        console.log(networkId)
        console.log(accounts)
        console.log(userAccount)
  
        // (todo) Make sure the contract is deployed on the network to which our provider is connected
        if (!(networkId in contractData.networks)) {
          throw new Error("Contract not found in selected Ethereum network on MetaMask.");
        }

        var contractAddress = contractData.networks[networkId].address;

        console.log("contractAddress = " + contractAddress)

        contract = new web3.eth.Contract(contractData.abi, contractAddress);
      })
      .catch(console.error);

    // Must be inside of "ready" block so elements have been loaded
    $("#generateButton").click(function() {
      console.log("TESTTTTTTT")
      var pricePerToken = $("#pricePerToken").val();
      var numberOfTokens = $("#numberOfTokens").val();
      console.log("Price = " + pricePerToken)
      console.log("Number of Tokens = " + numberOfTokens)

      // TODO: Add call to mint new ERC721 tokens with amount and given price
      // mint(amount)

      // TODO if call is successful than display successful message
      // Else display error
      $("#tokenCreated").show();
    })

    // TODO: Replace with call to check if user has token
    userHasToken = false

    if(userHasToken) {
      $("#song").show();
    } else {
      $("#buyToken").show();
    }

    // Must be inside of "ready" block so elements have been loaded
    $("#purchaseToken").click(function() {
      console.log("TESTTTTTTT")
      
      // TODO: Add call to purchase new ERC 721 token and add to account

      $("#tokenPurchased").show();

    })
}
$(document).ready(app);


