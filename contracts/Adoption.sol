pragma solidity ^0.5.0;

contract Adoption {

  event Deposit(
    uint _value
  );

  address[16] public adopters;
  mapping (string => Item) items;

  struct Item {
    string name;
    uint tickets;
    mapping(address => uint) owners;
  }

  function buyItem(string memory itemId, uint numOfTickets) public payable returns (uint) {
    items[itemId].owners[msg.sender] = items[itemId].owners[msg.sender]+numOfTickets;
    emit Deposit(items[itemId].owners[msg.sender]);
    return items[itemId].owners[msg.sender];
  }

  function createItem(string memory itemId, string memory _name, uint _tickets) public returns (uint){
    Item memory i;
    i.name = _name;
    i.tickets = _tickets;
    items[itemId] = i;
    items[itemId].owners[msg.sender] = 0;
    emit Deposit(items[itemId].owners[msg.sender]);
    return items[itemId].tickets;
  }

  function checkItem(string memory itemId) public view returns (uint) {
    uint ownedTickets = items[itemId].owners[msg.sender];
    /* emit Deposit(ownedTickets); */
    return ownedTickets;
  }

  // Adopting a pet
  function adopt(uint petId) public returns (uint) {
    emit Deposit(uint(3));
    require(petId >= 0 && petId <= 15);
    adopters[petId] = msg.sender;
    return petId;
  }

}
