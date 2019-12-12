pragma solidity ^0.5.0;

contract Adoption {

  event Deposit(
    uint _value
  );

  event With(
    address _add
  );

  struct Item {
    string name;
    uint tickets;
    address payable creator;
    mapping(address => uint) owners;
  }

  address[16] public adopters;
  string[] public itemIdList;
  uint public counter;
  mapping (string => Item) items;


  function buyItem(string memory itemId, uint numOfTickets) public payable returns (uint) {
    items[itemId].owners[msg.sender] = items[itemId].owners[msg.sender]+numOfTickets;
    items[itemId].tickets = items[itemId].tickets - numOfTickets;
    items[itemId].creator.transfer(msg.value);
    emit Deposit(items[itemId].tickets);
    emit With(msg.sender);
    return items[itemId].owners[msg.sender];
  }

  function createItem(string memory itemId, string memory _name, uint _tickets) public returns (uint){
    Item memory i;
    i.name = _name;
    i.tickets = _tickets;
    i.creator = msg.sender;
    items[itemId] = i;
    items[itemId].owners[msg.sender] = 0;
    itemIdList.push(itemId);
    counter++;
    emit Deposit(items[itemId].owners[msg.sender]);
    emit With(items[itemId].creator);
    return items[itemId].tickets;
  }

  function checkItem(string memory itemId) public view returns (uint) {
    uint ownedTickets = items[itemId].owners[msg.sender];
    return ownedTickets;
  }

  function checkAvailability(string memory itemId) public view returns (uint) {
    uint availableTickets = items[itemId].tickets;
    return availableTickets;
  }

  function getCreator(string memory itemId) public view returns (address) {
    address creatorAddress = items[itemId].creator;
    return creatorAddress;
  }

  function initialFunction() public view returns (bytes32[] memory,bytes32[] memory,uint[] memory) {
    bytes32[] memory nameList = new bytes32[](counter);
    bytes32[] memory idList = new bytes32[](counter);
    uint[] memory ticketList = new uint[](counter);
    for (uint i = 0; i < itemIdList.length; i++) {
      if (keccak256(abi.encodePacked(itemIdList[i])) == keccak256(abi.encodePacked("-1"))) { //deleted value is -1
        continue;
      }
      string memory currentId = itemIdList[i];
      Item memory currentItem = items[currentId];
      nameList[i] = stringToBytes32(currentItem.name);
      idList[i] = stringToBytes32(itemIdList[i]);
      ticketList[i] = currentItem.tickets;
    }
    return (nameList, idList, ticketList);
  }

  function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }
    assembly {
        result := mload(add(source, 32))
    }
  }

  // Adopting a pet
  function adopt(uint petId) public returns (uint) {
    emit Deposit(uint(3));
    require(petId >= 0 && petId <= 15);
    adopters[petId] = msg.sender;
    return petId;
  }

}
