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
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App. buyItem);
    $(document).on('click', '.btn-create', App.createItem);
    $(document).on('click', '.btn-check', App.checkItem);
  },

   buyItem: async function(event) {
    event.preventDefault();
    var  itemId = $(event.target).data('id');
    var quantityId = "quantity"+ itemId;
    var numOfTickets = document.getElementById(quantityId).value;
    var priceId = "price"+ itemId;
    var price = document.getElementById(priceId).innerHTML;
    var totalPrice = price * numOfTickets;
    console.log("Total Price: "+totalPrice);
    var ticketsAvailable = sessionStorage.getItem( itemId);
    if (ticketsAvailable-numOfTickets < 0) {
      alert("There is not enough tickets available");
      return;
    }
    var accounts = web3.eth.getAccounts;
    var account = accounts[0]
    console.log("1");
    var contract = await App.contracts.Adoption.deployed();
    console.log("2");
    var r = contract.Deposit();
    r.watch(function(error, result){
      console.log("buyItem()=> items[itemId].owners[msg.sender]: "+result.args._value);
      r.stopWatching();
    });
    console.log("4");
    await contract.buyItem( itemId, numOfTickets, {from:account, value:totalPrice*(10**18)});
    sessionStorage.setItem( itemId, ticketsAvailable-numOfTickets)
    var ticketId = "ticket"+ itemId;
    document.getElementById(ticketId).innerHTML = ticketsAvailable-numOfTickets;
  },

  createItem: async function(event) {
    event.preventDefault();
    var  itemId =  uuidv4();
    var name = document.getElementById("event_name").value;
    if (sessionStorage.getItem(name) !== null) {
      alert("There cannot be an event with the same name")
      return;
    }
    var numOfTickets = document.getElementById("numOfTickets").value;
    var location = document.getElementById("location").value;
    var date = document.getElementById("date").value;
    var price = document.getElementById("price").value;
    var accounts = web3.eth.getAccounts;
    var account = accounts[0]
    console.log("1");
    var contract = await App.contracts.Adoption.deployed();
    console.log("2");
    var r = contract.Deposit();
    r.watch(function(error, result){
      console.log("createItem()=> items[itemId].owners[msg.sender]: "+result.args._value);
      r.stopWatching();
    });
    await contract.createItem( itemId, name, numOfTickets, {from:account});
    sessionStorage.setItem( itemId, numOfTickets);
    sessionStorage.setItem(name,  itemId);
    console.log("3");
    var petTemplate = $('#petTemplate');
    var petsRow = $('#petsRow');
    petTemplate.find('.panel-title').text(name);
    petTemplate.find('.pet-age').text(numOfTickets);
    var newTicketId = "ticket"+ itemId;
    petTemplate.find('.pet-age').attr('id', newTicketId);
    petTemplate.find('.pet-location').text(location);
    petTemplate.find('.pet-date').text(date);
    petTemplate.find('.pet-price').text(price);
    var newPriceId = "price"+ itemId;
    console.log("newPriceId: "+newPriceId)
    petTemplate.find('.pet-price').attr('id', newPriceId);
    petTemplate.find('.btn-adopt').attr('data-id',  itemId);
    petTemplate.find('.pet-breed').text( itemId);
    var newQuantityId = "quantity"+ itemId;
    petTemplate.find('.quantity').attr("id", newQuantityId);
    petsRow.append(petTemplate.html());
    sessionStorage.setItem("id",  itemId);
    alert("New event with ID: "+ itemId+" is created.")
  },

  checkItem: async function(event){
    event.preventDefault();
    var id = document.getElementById("idToBeChecked").value;
    var account = web3.eth.getAccounts[0];
    console.log("1");
    var contract = await App.contracts.Adoption.deployed();
    console.log("2");
    var r = contract.Deposit();
    r.watch(function(error, result){
      console.log("checkItem()=> items[itemId].owners[msg.sender]: "+result.args._value);
      var toBeReplaced = "You own <strong>"+result.args._value+"</strong> ticket(s).";
      console.log(toBeReplaced);
      document.getElementById("resultOfChecked").innerHTML = toBeReplaced
      r.stopWatching();
    });
    console.log("3");
    await contract.checkItem(id, {from:account});
    console.log("4");
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
