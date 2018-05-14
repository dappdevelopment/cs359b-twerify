pragma solidity ^0.4.17;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ContentToken is ERC721Token, Ownable {
  string public constant _name = "ContentToken";
  string public constant _symbol = "CON";
  uint256 private constant _price = 0.1 ether;

  //token id and metadata 

  function purchaseContent() public payable {
    require(msg.value == _price);
    _mint(msg.sender, totalSupply());
  }

  function hasValidAccess(address _owner) public view returns (bool)  {
    if (balanceOf(_owner) > 1) return true;
    return false;
  }
}