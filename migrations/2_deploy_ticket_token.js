var TicketToken = artifacts.require("TicketToken");  
module.exports = function(deployer) {
    deployer.deploy(TicketToken);
};
