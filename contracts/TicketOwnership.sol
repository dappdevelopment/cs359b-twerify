pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract TicketOwnership is TicketBase, ERC721Token {
	string public constant name = "AccessTokens";
	string public constant symbol = "AT";

	// internal utility functions
	function _owns(address _claimant, uint256 _ticketId) internal view returns (bool) {
		return ticketIndexToOwner[_ticketId] == _claimant;
	}

	function _approvedFor(address _claimant, uint256 _ticketId) internal view returns (bool) {
		return ticketIndexToApproved[_ticketId] == _claimant;
	}

	function _approve(uint256 _ticketId, address _approved) internal {
		ticketIndexToApproved[_ticketId] = _approved;
	}

	function balanceOf(address _owner) public view returns (uint256 count) {
		return ownershipTokenCount[_owner];
	}

	function transfer(address _to, uint256 _tokenId) external {
		require(_to != address(0));
		require(_owns(msg.sender, _tokenId));
		_transfer(msg.sender, _to, _tokenId);
	}

	function approve(address _to, uint256 _tokenId) external {
		require(_owns(msg.sender, _tokenId));
		_approve(_tokenId, _to);
		Approval(msg.sender, _to, _tokenId);
	}

	function transferFrom(address _from, address _to, uint256 _tokenId) external {
        
        require(_to != address(0));
        
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        _transfer(_from, _to, _tokenId);
    }


    function totalSupply() public view returns (uint) {
        return tickets.length - 1;
    }


    function ownerOf(uint256 _tokenId) external view returns (address owner) {
        owner = ticketIndexToOwner[_tokenId];

        require(owner != address(0));
    }

    // inspired by crypto kitties example here: https://ethfiddle.com/09YbyJRfiI
    /// @notice Don't call this from smart contract because its slow af
    function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalTickets = totalSupply();
            uint256 resultIndex = 0;

            //ticket IDs begin at 1
            uint256 ticketId;

            for (ticketId = 1; ticketId <= totalTickets; ticketId++) {
                if (ticketIndexToOwner[ticketId] == _owner) {
                    result[resultIndex] = ticketId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}