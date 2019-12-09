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

contract TestAdoption {

 Adoption adoption = Adoption(DeployedAddresses.Adoption());// The address of the adoption contract to be tested
 string expectedPetId = "0"; // The id of the pet that will be used for testing
 uint boughtTickets = 2;
 uint totalTickets = 8;
 string name = "John";
 address expectedAdopter = address(this); //The expected owner of adopted pet is this contract

 function testCreateItem() public {
   uint returnedId = adoption.createItem(expectedPetId, name, totalTickets);
   Assert.equal(returnedId, totalTickets, "Creation of the expected pet should match what is returned.");
 }

 function testBuyItem() public {
   uint returnedId = adoption.buyItem(expectedPetId, boughtTickets);
   Assert.equal(returnedId, boughtTickets, "Adoption of the expected pet should match what is returned.");
 }

 function testCheckItem() public {
   uint returnedBoughtTickets = adoption.checkItem(expectedPetId);
   Assert.equal(returnedBoughtTickets, boughtTickets, "Adoption of the expected pet should match what is returned.");
 }

 /* // Testing the adopt() function
 function testUserCanAdoptPet() public {
  uint returnedId = adoption.adopt(expectedPetId);
  Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
 } */

  function test() public {
    Assert.equal(uint(3), uint(4), "GG");
  }

}
