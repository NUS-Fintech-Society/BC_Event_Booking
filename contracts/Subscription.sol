pragma solidity ^0.5.0;

contract Subscription {

  uint ans = 0;
  mapping (address => uint) person;
  bool isTrue;

  event PrintString(
    string _value
  );

  function subscribe(uint numOfMonths) public payable {
    emit PrintString("subscribe is called!");
    if (person[msg.sender] <= block.timestamp) {
      person[msg.sender] = block.timestamp + (1 * numOfMonths);
    } else {
      person[msg.sender] = person[msg.sender] + (1 * numOfMonths);
    }
  }
/* 2592000 */

  function fake() public {

  }

  function checkSubscription() public view returns(bool) {
     return (block.timestamp < person[msg.sender]);
  }

}
