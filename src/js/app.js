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
    $(document).on('click', '.btn-init', App.initEvents);
    // await App.initEvents();
  },

  initEvents: async function() {
    var account = web3.eth.getAccounts[0];
    var contract = await App.contracts.Adoption.deployed();
    var g = await contract.initialFunction({from:account});
    var petTemplate = $('#petTemplate');
    var petsRow = $('#petsRow');
    for (var i = 0; i < g[0].length; i++) {
      var name = g[0][i];
      var id = g[1][i];
      var tickets = g[2][i];
      name = name.replace("0x","");
      name = App.hexStringToString(name);
      id = id.replace("0x","");
      id = App.hexStringToString(id);
      tickets = tickets["c"][0];

      var newTicketId = "ticket"+ id;
      if (document.getElementById(newTicketId) !== null) {
        continue;
      }

      petTemplate.find('.panel-title').text(name);
      petTemplate.find('.pet-age').text(tickets);
      var newTicketId = "ticket"+ id;
      petTemplate.find('.pet-age').attr('id', newTicketId);
      petTemplate.find('.pet-location').text("not stored");
      petTemplate.find('.pet-date').text("not stored");
      petTemplate.find('.pet-price').text("not stored");
      var newPriceId = "price"+ id;
      petTemplate.find('.pet-price').attr('id', newPriceId);
      petTemplate.find('.btn-adopt').attr('data-id',  id);
      petTemplate.find('.pet-breed').text(id);
      var newQuantityId = "quantity"+ id;
      petTemplate.find('.quantity').attr("id", newQuantityId);
      petsRow.append(petTemplate.html());
    }
  },

  buyItem: async function(event) {
    event.preventDefault();
    console.log("----------BuyItem() is called-------")
    var  itemId = $(event.target).data('id');
    var quantityId = "quantity"+ itemId;
    var numOfTickets = document.getElementById(quantityId).value;
    var priceId = "price"+ itemId;
    var price = document.getElementById(priceId).innerHTML;
    var totalPrice = price * numOfTickets;
    console.log("Total Price: "+totalPrice);
    var accounts = web3.eth.getAccounts;
    var account = accounts[0]
    var contract = await App.contracts.Adoption.deployed();
    var ticketsAvailable = await contract.checkAvailability(itemId,{from:account});
    console.log("ticketsAvailable: "+ticketsAvailable+" and numOfTickets: "+numOfTickets);
    console.log("ticketsAvailable < numOfTickets: "+(ticketsAvailable < numOfTickets));
    if (ticketsAvailable < numOfTickets) {
      alert("There is not enough tickets available");
      return;
  }
    await contract.buyItem( itemId, numOfTickets, {from:account, value:totalPrice*(10**18)});
    var ticketId = "ticket"+ itemId;
    document.getElementById(ticketId).innerHTML = ticketsAvailable-numOfTickets;
  },

  createItem: async function(event) {
    event.preventDefault();
    console.log("----------CreateItem() is called-------")
    var  itemId =  uuidv4();
    itemId = itemId.replace(/-/g,"");
    var name = document.getElementById("event_name").value;
    var numOfTickets = document.getElementById("numOfTickets").value;
    var location = document.getElementById("location").value;
    var date = document.getElementById("date").value;
    var price = document.getElementById("price").value;
    var accounts = web3.eth.getAccounts;
    var account = accounts[0]
    var contract = await App.contracts.Adoption.deployed();
    var r = contract.Deposit();
    r.watch(function(error, result){
      console.log("createItem()=> items[itemId].owners[msg.sender]: "+result.args._value);
      r.stopWatching();
    });
    await contract.createItem( itemId, name, numOfTickets, {from:account});
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
    alert("New event with ID: "+ itemId+" is created.")
  },

  checkItem: async function(event){
    event.preventDefault();
    console.log("----------CheckItem() is called-------")
    var id = document.getElementById("idToBeChecked").value;
    var account = web3.eth.getAccounts[0];
    var contract = await App.contracts.Adoption.deployed();
    var i = await contract.checkItem(id, {from:account});
    var toBeReplaced = "You own <strong>"+i+"</strong> ticket(s).";
    console.log(toBeReplaced);
    document.getElementById("resultOfChecked").innerHTML = toBeReplaced
  },

  hexStringToString: function(str1) {
    var hex  = str1.toString();
  	var str = '';
  	for (var n = 0; n < hex.length; n += 2) {
  		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  	}
  	return str;
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


// var r = contract.Deposit();
// r.watch(function(error, result){
//   console.log("checkItem()=> items[itemId].owners[msg.sender]: "+result.args._value);
//   var toBeReplaced = "You own <strong>"+result.args._value+"</strong> ticket(s).";
//   console.log(toBeReplaced);
//   document.getElementById("resultOfChecked").innerHTML = toBeReplaced
//   r.stopWatching();
// });
