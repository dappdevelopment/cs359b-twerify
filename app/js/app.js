function app() {
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
    console.log("Using web3 version: " + Web3.version);
  
    var contract;
    var userAccount;
  
    var contractDataPromise = $.getJSON('TwerifyToken.json');
    var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
    var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
  
    Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
      .then(function initApp(results) {
        var contractData = results[0];
        var networkId = results[1];
        var accounts = results[2];
        userAccount = accounts[0];
  
        // (todo) Make sure the contract is deployed on the network to which our provider is connected
        if (!(networkId in contractData.networks)) {
          throw new Error("Contract not found in selected Ethereum network on MetaMask.");
        }

        var contractAddress = contractData.networks[networkId].address;
        contract = new web3.eth.Contract(contractData.abi, contractAddress);
      })
      .then(refreshBalance)
      .catch(console.error);

    function refreshBalance() { // Returns web3's PromiEvent
     // Calling the contract (try with/without declaring view)
     contract.methods.balanceOf(userAccount).call().then(function (balance) {
       $('#display').text(balance + " CDT");
       $("#loader").hide();
     });
    };

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

    // Psuedo code for customer view
    // If user is logged in and has a token
      // Show image
    // Otherwise
      // Show button to buy token

}
$(document).ready(app);


function transfer(to, amount) {
  console.log(to, amount)
  if (!to || !amount) return console.log("Fill in both fields");

  $("#loader").show();

  contract.methods.transfer(to, amount).send({from: userAccount})
    .then(refreshBalance)
    .catch(function (e) {
      $("#loader").hide();
    });
}

$("#button").click(function() {
  var toAddress = $("#address").val();
  var amount = $("#amount").val();
  transfer(toAddress, amount);
});

function mint(amount) {
  console.log(amount)
  if (!amount) return console.log("Fill in the amount to mint");

  $("#loader").show();

  contract.methods.mint(amount).send({from: userAccount})
    .then(refreshBalance)
    .catch(function (e) {
      $("#loader").hide();
    });
}


