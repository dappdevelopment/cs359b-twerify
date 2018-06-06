pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract TicketToken is ERC721Token("TicketToken","TIK"), Ownable {
  

  struct Ticket {
    address creator;
    string hostURL;
    uint256 price;
  }

  Ticket[] tickets;

  mapping (string => address) hostURLToCreator;
  mapping (string => uint256) hostURLToNumLeft;
  mapping (string => uint256) hostURLToPrice;

  /**
   * @dev Constructor function
   */
  constructor() public {}


  function getTicket(uint256 _ticketId) public view returns (address creator, string hostURL, uint256 price) {
    Ticket memory _ticket = tickets[_ticketId];

    creator = _ticket.creator;
    hostURL = _ticket.hostURL;
    price = _ticket.price;
  }

  function generate(address _creator, string _hostURL, uint256 _price, uint256 _count) public returns (address creator, uint256 count, uint256 price) {
    require(_count >= 1 && _count <= 100);
    if (hostURLToCreator[_hostURL] != address(0x0)) {
      require(hostURLToCreator[_hostURL] == msg.sender);
      hostURLToNumLeft[_hostURL] += _count;
      hostURLToPrice[_hostURL] = _price;
    } else {
      hostURLToCreator[_hostURL] = _creator;
      hostURLToNumLeft[_hostURL] = _count;
      hostURLToPrice[_hostURL] = _price;
    }
    creator = hostURLToCreator[_hostURL];
    count = hostURLToNumLeft[_hostURL];
    price = hostURLToPrice[_hostURL];
  }

  function hasValidAccess(address _viewer, string _hostURL) public view returns (bool)  {

    //return true;


    uint256 _ticketCount = balanceOf(_viewer);

    if (_ticketCount > 0) return true;

    address creator = hostURLToCreator[_hostURL];
    if (_viewer == creator) return true;

    return false;

    //////////////////

    // uint256 _ticketCount = balanceOf(_viewer);

    // if (_ticketCount == 0) {
    //   return false;
    // } else {
    //   address creator = hostURLToCreator[_hostURL];
    //   if (_viewer == creator) return true;

    //   uint256[] _ownedTickets = ownedTokens[_viewer];

    //   for (uint256 i = 0; i < _ownedTickets.length; i++) {
    //     uint256 _ticketId = _ownedTickets[i];
    //     Ticket memory _ticket = tickets[_ticketId];
    //     if (compareStrings(_ticket.hostURL,_hostURL)) return true;
    //   }

    //   return false;
    // }
  }

  function purchaseTicket(string _hostURL) public payable {

    address _creator = hostURLToCreator[_hostURL];
    uint256 _price = hostURLToPrice[_hostURL];
    //require(msg.value >= _price);

    Ticket memory _ticket = Ticket({creator: _creator, hostURL: _hostURL, price: _price});
    uint256 _ticketId = tickets.push(_ticket) - 1;

    _mint(msg.sender, _ticketId);
    hostURLToNumLeft[_hostURL]--;
  
    _creator.transfer(msg.value);

    // if (hostURLToNumLeft[_hostURL] > 0) {
    //   address _creator = hostURLToCreator[_hostURL];
    //   uint256 _price = hostURLToPrice[_hostURL];
    //   //require(msg.value >= _price);

    //   Ticket memory _ticket = Ticket({creator: _creator, hostURL: _hostURL, price: _price});
    //   uint256 _ticketId = tickets.push(_ticket) - 1;

    //   _mint(msg.sender, _ticketId);
    //   hostURLToNumLeft[_hostURL]--;
    
    //   _creator.transfer(msg.value);
    // }
  }

  function compareStrings (string a, string b) view returns (bool){
    return keccak256(a) == keccak256(b);
  }
}