pragma solidity ^0.4.17;

contract TicketBase {
	event Creation(address creator, uint256 ticketId);
	event Transfer(address from, address to, uint256 ticketId);

	struct Ticket {
		address creator;
		string hostURL;
		uint256 price;
	}

	Ticket[] tickets;

	mapping (uint256 => address) public ticketIndexToOwner;

	mapping (uint256 => creator) public ticketIndexToCreator;

	mapping (string => uint256) public hostUrlToNumCreatorOwned; 

	mapping (address => uint256) ownershipTokenCount;

	mapping (uint256 => address) public ticketIndexToApproved;

	function _transfer(address _from, address _to, uint256 _ticketId) internal {
		ownershipTokenCount[_to]++;

		ticketIndexToOwner[_ticketId] = _to;

		if (_from != address(0)) {
			ownershipTokenCount[_from]--;
		}

		if (_from == ticketIndexToCreator[_ticketId]) {
			hostUrlToNumCreatorOwned[tickets[_ticketId].hostURL]--;
		}

		Transfer(_from, _to, _ticketId)
	}

	function _createTicket(address _creator, string _hostURL, uint256 _price) internal returns (uint256) {
		Ticket memory _ticket = Ticket({
			creator: _creator,
			hostURL: _hostURL,
			price: _price,
		});
		uint256 newTicketId = tickets.push(_ticket) - 1;

		hostUrlToNumCreatorOwned[_hostURL]++;

		Creation(_creator, newTicketId);

		_transfer(0, _creator, newTicketId);

		return newTicketId;
	}
}