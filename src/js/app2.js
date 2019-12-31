App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {// Modern dapp browsers...
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();// Request account access
      } catch (error) {
        console.error("User denied account access")// User denied account access...
      }
    }
    else if (window.web3) {// Legacy dapp browsers...
      App.web3Provider = window.web3.currentProvider;
    }
    else {// If no injected web3 instance is detected, fall back to Ganache
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      App.web3Provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
    }
    web3 = new Web3(App.web3Provider);
    console.log(web3)
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);// Set the provider for our contract
      // return App.markAdopted();// Use our contract to retrieve and mark the adopted pets
    });
    $.getJSON('Subscription.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Subscription = TruffleContract(AdoptionArtifact);
      App.contracts.Subscription.setProvider(App.web3Provider);// Set the provider for our contract
      // return App.markAdopted();// Use our contract to retrieve and mark the adopted pets
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    // $(document).on('click', '.btn-sub', App.subcribe);
    $(document).on('click', '.btn-check', App.check);
  },

  subscribe: async function(clicked_id) {
    console.log("Subscribe() is called for: " + clicked_id + " months");
    var account = web3.eth.getAccounts[0];
    var value = -1;
    if (clicked_id == 1) {
      value = 1;
    } else if (clicked_id == 3) {
      value = 1.5;
    } else if (clicked_id == 12){
      value = 3;
    }
    var contract = await App.contracts.Subscription.deployed();
    await contract.subscribe(clicked_id, {from:account, value: value * (10**18)});
  },

  check: async function() {
    var account = web3.eth.getAccounts[0];
    var contract = await App.contracts.Subscription.deployed();
    await contract.fake({from:account});
    var ans = await contract.checkSubscription({from:account});
    if (ans) {
      var toBeReplaced = "You are currently subscribed";
    } else {
      toBeReplaced = "You are currently NOT subscribed";
    }
    console.log(toBeReplaced);
    document.getElementById("ResultOfSubCheck").innerHTML = toBeReplaced
  }

  };

$(function() {
  $(window).load(function() {
    console.log("2nd window has loaded");
    App.init();
  });
});
