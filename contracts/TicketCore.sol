pragma solidity ^0.4.17;

contract TicketCore is TicketOwnership {

	function generate(address _creator, string _hostURL, uint256 _price, uint256 _count) public payable {
		require(msg.value >= _price * _count)
		
		for (uint256 i = 0; i < _count; i++) {
			_createTicket(_creator, _hostURL, _price);
		}
	}

	function purchaseTicket(address _owner, string _hostURL) {

		// Check outstanding tokens
		require(_hostURLToNumCreatorOwned[_hostURL] > 0)

		// Transfer money

		// Transfer coin

	}



}
