# FintechSocDapp
<h4>To run the application</h4>
<ol>
<li>npm install lite-server --save-dev</li>
<li>truffle compile</li>
<li>truffle migrate --reset</li>
<li>truffle test (optional)</li>
<li>npm run dev</li>
</ol>
<h4>Notes</h4>
<ul>
<li><s>Step 4 should have 6 passing and 1 failing</s></li>
<li>If you want to run step 4, you need to comment out a line in buyItem() of Adoption.sol. After that it will be 7 pass and 1 fail.</li> 
<li>If when you try the functionalities and there is an rpc error, try resetting your metamask account</li>
</ul>

<br>
<br>
<br>

| Features                                         | Clean up                                                  |
|--------------------------------------------------|-----------------------------------------------------------|
| Exchange (2nd hand market)                       | Removal of event on passing the date        |
| Bidding - VIP seats  (?)                         | Validation: Check duplicate of event names           |
| Subscription Service (?)                         | Store price, date and location on the chain                |

<br>
<br>
<br>
<br>

Based off: https://www.trufflesuite.com/tutorials/pet-shop
