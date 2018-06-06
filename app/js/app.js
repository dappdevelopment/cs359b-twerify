var Web3 = require('web3');

// production vs. dev
if (window.location.hostname == '') {
  network_id = 3;
} else {
  network_id = 5777 // ganache - ethereum network ID
}

// Check for Metamask and show/hide appropriate warnings.
window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if ((typeof web3 !== 'undefined') && (web3.givenProvider !== null)) {
    var web3js = new Web3(web3.currentProvider);

    // Checking if user is logged into an account
    web3js.eth.getAccounts(function(err, accounts){
        if (err != null) console.error("An error occurred: "+err);
        // User is not logged into Metamask
        else if (accounts.length == 0) {
          $('#metamask-login').show();
          console.log("User is not logged in to MetaMask");
        }
    });

  // User does not have Metamask / web3 provider
  } else {
    console.log('No web3? You should consider trying MetaMask!');
    $('#metamask-install').show();
  }
})

function app() {
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
    console.log("Using web3 version: " + Web3.version);
  
    var contract;
    var userAccount;
  
    var contractDataPromise = $.getJSON('TicketToken.json');
    var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
    var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
    var isLocal = true;
    var path = "https://dapps.stanford.edu/twerify/"; //TODO FIX PATH
    if (isLocal) {
      path = "https://localhost:3000/tickets/"
    }

    $.get(path + "view", function(data) {
      //TODO render HTML for each song with the right link
    })

    Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
      .then(function initApp(results) {
        var contractData = results[0];
        var networkId = results[1];

        // TODO: Why is results[1] always 1??? For now override it based on production vs. dev
        //networkId = 5777;
        
        var accounts = results[2];

        //User not logged into MetaMask
        if (accounts.length == 0) {
          $('#metamask-login').show();
          console.log("User not logged into MetaMask");
        }


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
      .then(function () {
        var userHasToken = true;
        console.log("starting checking");
        //fire loading UI

        hostURL = "youtube.com";

        contract.methods.hasValidAccess(userAccount, hostURL).call({'from': userAccount}, 
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              if(result) {
                console.log("showing song");
                $("#song").show();
              } else {
                console.log("showing buy");
                $("#buyToken").show();
                //hide the loader UI
              }
            }
          }
        );
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
      hostURL = 'youtube.com'
      console.log(userAccount);

      contract.methods.generate(userAccount, hostURL, pricePerToken, numberOfTokens).send({'from': userAccount}, 
        function (err, transactionHash) {
          if (err) {
            console.log(err);
          } else {
            console.log("Success");
            console.log(transactionHash);
            $("#tokenCreated").show();
          }
        }
      );
    })

    // TODO: Replace with call to check if user has token


    $('#checkBalance').click(function() {
      console.log("CHECK BALANCE");

      contract.methods.balanceOf(userAccount).call({'from': userAccount}, 
        function (err, balance) {
          if (err) {
            console.log(err);
          } else {
            console.log(balance);
            $('#display').text(balance + " Tokens");
            $('#display').show();
          }
        }
      );
    });


    // Must be inside of "ready" block so elements have been loaded
    $("#purchaseToken").click(function() {
      console.log("PURCHASE")

      var hostURL = "youtube.com"

      // TODO: Need some way to handle price and url
      
      contract.methods.purchaseTicket(hostURL).send({'from': userAccount, 
        'value': web3.utils.toWei("10", 'ether')}, 
        function (err, transactionHash) { 
          if (err) {
            console.log(err, transactionHash);
          } else {
            $("#tokenPurchased").show();
          }
      });

    })
}

$(document).ready(app);


