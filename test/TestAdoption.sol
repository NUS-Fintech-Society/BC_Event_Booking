/* pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
 // The address of the adoption contract to be tested
 Adoption adoption = Adoption(DeployedAddresses.Adoption());

 // The id of the pet that will be used for testing
 uint expectedPetId = 8;

 //The expected owner of adopted pet is this contract
 address expectedAdopter = address(this);

 // Testing the adopt() function
function testUserCanAdoptPet() public {
  uint returnedId = adoption.adopt(expectedPetId);

  Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
 }

} */


pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";
import "../contracts/Subscription.sol";

contract TestAdoption {

  event Deposit(
    uint _value
  );

 Adoption adoption = Adoption(DeployedAddresses.Adoption());// The address of the adoption contract to be tested
 Adoption subscription = Adoption(DeployedAddresses.Subscription());
 uint public initialBalance = 1 ether;
 string public expectedPetId = "h1"; // The id of the pet that will be used for testing
 uint public boughtTickets = 2;
 uint public totalTickets = 8;
 uint public remainingTickets = 6;
 string public name = "John";
 address public expectedAdopter = address(this); //The expected owner of adopted pet is this contract
 string public expectedLocation = "loc";
 uint public expectedDate = 20190812;
 uint public expectedPrice = 1;
 uint public daysToSub = 30;
 bool public isSubscribed = true;

 function testSub() public {
   subscription.subcribe(daysToSub);
   bool returnedSubbedStatus = adoption.isSubscribe(expectedAdopter);
   Assert.equal(true, isSubscribed, "Creation of the expected pet should match what is returned.");
 }

 function testCreateItem() public {
   uint returnedId = adoption.createItem(expectedPetId, name, totalTickets, expectedLocation, expectedDate, expectedPrice);
   Assert.equal(returnedId, totalTickets, "Creation of the expected pet should match what is returned.");
 }

 function testBuyItem() public {
   uint b = adoption.buyItem.value(1)(expectedPetId, boughtTickets);
   Assert.equal(b, boughtTickets, "Adoption of the expected pet should match what is returned.");
 }

 function testCheckItem() public {
   uint returnedBoughtTickets = adoption.checkItem(expectedPetId);
   Assert.equal(returnedBoughtTickets, boughtTickets, "Adoption of the expected pet should match what is returned.");
 }

 function testCheckAvailability() public {
   uint returnedAvailableTickets = adoption.checkAvailability(expectedPetId);
   Assert.equal(returnedAvailableTickets, remainingTickets, "Adoption of the expected pet should match what is returned.");
 }

 function testGetCreator() public {
   address returnedCreator = adoption.getCreator(expectedPetId);
   Assert.equal(returnedCreator, expectedAdopter, "Adoption of the expected pet should match what is returned.");
 }

 function testInitialFunction() public {
   (bytes32[] memory names, bytes32[] memory id, uint[] memory tickets, bytes32[] memory locationList, uint[] memory dateList, uint[] memory priceList) = adoption.initialFunction();
   bytes32 returnedBytesName= names[0];
   bytes32 expectedBytesName= stringToBytes32(name);
   uint returnedDate= dateList[0];
   Assert.equal(returnedBytesName,expectedBytesName, "The first event is not the one we have just inserted");
   Assert.equal(returnedDate,expectedDate, "The first event is not the one we have just inserted");
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

  function test() public {
    Assert.equal(uint(3), uint(4), "GG");
  }

}
