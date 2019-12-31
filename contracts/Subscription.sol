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
/* 2592000s = 1 month. Replace the 1 in line 16 and 18 with this to represent subbing for 1 month*/

  function fake() public {
    /*to ensure the block's time stamp is representative of current time*/
    /*called in app.js buyItem()*/
  }

  function checkSubscription() public view returns(bool) {
     return (block.timestamp < person[msg.sender]);
  }

}
