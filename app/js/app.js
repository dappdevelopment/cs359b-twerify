var Web3 = require('web3');

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
      path = "https://localhost:3000/"
    }

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
      .catch(console.error);

    // Must be inside of "ready" block so elements have been loaded
    function generate(name, price, numTokens) {
      console.log("Price = " + price)
      console.log("Number of Tokens = " + numTokens)

      hostURL = name;
      console.log(userAccount);

      contract.methods.generate(userAccount, hostURL, price, numTokens).send({'from': userAccount}, 
        function (err, transactionHash) {
          if (err) {
            console.log(err);
          } else {
            //TEST THIS
            document.getElementById("uploadForm").submit();
          }
        }
      );
    }

    function purchase(hostURL, price) {
      contract.methods.purchaseTicket(hostURL).send({'from': userAccount, 
        'value': web3.utils.toWei(str(price), 'ether')}, 
        function (err, transactionHash) { 
          if (err) {
            console.log(err, transactionHash);
          } else {
            $("#tokenPurchased").show();
          }
      });
    }

    function checkValidAccess(hostURL) {
        contract.methods.hasValidAccess(userAccount, hostURL).call({'from': userAccount}, 
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              if(result) {
                //TODO ASK THE SERVER THE PLAY PAGE
                console.log("showing song");
                $.get(path + 'listen/' + hostURL, console.log);
              } else {
                //ASK TEH SERVER FOR THE BUY PAGE
                console.log("showing buy");
                $.get(path + 'buy/' + hostURL, console.log);
                //hide the loader UI
              }
            }
          }
        );
    }

    function checkAccess() {
      checkValidAccess(this.id);
    }

    $("#generate_button").click(function() {
      var price = $('input[name=price]').val();
      var numTickets = $('input[name=numTickets]').val();
      var name = $('input[name=name]').val();

      generate(name, price, numTickets);
    });

    $("#purchase_button").click(function() {
      var price = $('h2[name=price]').val() //grab the price from an element;
      var hostURL = $('h2[name=hostURL]').val() //grab the hostURL from an element

      purchase(hostURL, price);
    })

    songs = document.getElementsByClassName('song-box');
    for (var i = 0; i < songs.length; i++) {
      songs[i].addEventListener('click', checkAccess, false);
    }

}

$(document).ready(app);


