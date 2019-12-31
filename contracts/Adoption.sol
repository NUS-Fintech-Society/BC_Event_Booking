pragma solidity ^0.5.0;

import "./Subscription.sol";

contract Adoption {

  Subscription sb;

  constructor (Subscription _t) public {
    sb = Subscription(_t);
  }

  event Deposit(
    uint _value
  );

  event With(
    address _add
  );

  event Draw(
    bool _value
  );

  struct Item {
    string name;
    uint tickets;
    address payable creator;
    string location;
    uint date;
    uint price;
    mapping(address => uint) owners;
  }

  address[16] public adopters;
  string[] public itemIdList;
  uint public counter;
  mapping (string => Item) items;

  function isSubscribe() public returns (bool) {
    /* bool ans = sb.checkSubscription();
    return ans; */
  }

  function createItem(string memory itemId, string memory _name, uint _tickets,
                      string memory _location, uint _date, uint _price)
                      public returns (uint){
    Item memory i;
    i.name = _name;
    i.tickets = _tickets;
    i.creator = msg.sender;
    i.location = _location;
    i.date = _date;
    i.price = _price;
    items[itemId] = i;
    items[itemId].owners[msg.sender] = 0;
    itemIdList.push(itemId);
    counter++;
    emit Deposit(items[itemId].tickets);
    emit Deposit(items[itemId].owners[msg.sender]);
    emit With(items[itemId].creator);
    return items[itemId].tickets;
  }

  function buyItem(string memory itemId, uint numOfTickets) public payable returns (uint) {
    items[itemId].owners[msg.sender] = items[itemId].owners[msg.sender]+numOfTickets;
    items[itemId].tickets = items[itemId].tickets - numOfTickets;
    /* items[itemId].creator.transfer(msg.value); //comment out for when running test */
    emit Deposit(msg.value);
    emit Deposit(items[itemId].tickets);
    emit With(msg.sender);
    return items[itemId].owners[msg.sender];
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

  function initialFunction() public view returns (bytes32[] memory,bytes32[] memory,uint[] memory, bytes32[] memory, uint[] memory, uint[] memory) {
    bytes32[] memory nameList = new bytes32[](counter);
    bytes32[] memory idList = new bytes32[](counter);
    uint[] memory ticketList = new uint[](counter);
    bytes32[] memory locationList = new bytes32[](counter);
    uint[] memory dateList = new uint[](counter);
    uint[] memory priceList = new uint[](counter);
    for (uint i = 0; i < itemIdList.length; i++) {
      if (keccak256(abi.encodePacked(itemIdList[i])) == keccak256(abi.encodePacked("-1"))) { //deleted value is -1
        continue;
      }
      string memory currentId = itemIdList[i];
      Item memory currentItem = items[currentId];
      nameList[i] = stringToBytes32(currentItem.name);
      idList[i] = stringToBytes32(itemIdList[i]);
      ticketList[i] = currentItem.tickets;
      locationList[i] = stringToBytes32(currentItem.location);
      dateList[i] = currentItem.date;
      priceList[i] = currentItem.price;
    }
    return (nameList, idList, ticketList, locationList, dateList, priceList);
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
