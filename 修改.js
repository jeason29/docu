pragma solidity ^0.4.13;

contract gambling {
    
    uint256 public BALANCE;
	uint256 public BET;
    address public OWNER;
    mapping (address => uint256) public INVESTING_LIST;
    address[] INVESTOR;
    
    modifier onlyOwner() {
        if (msg.sender != OWNER) {
            revert();
        }
        _;
    }
    
    modifier onlyInvestor() {
        if (! isInvestor(msg.sender)) {
            revert();
        }
        _;
    }
    
    modifier onlyWithValue() {
        if (msg.value == 0) {
            revert();
        }
        _;
    }

    function changeOwner(address new_owner) onlyOwner {
        OWNER = new_owner;
    }
    
    function isInvestor(address addr) constant returns (bool) {
        for (uint i=0;i<INVESTOR.length;i++) {
            if (INVESTOR[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
    function investorCount() constant returns (uint) {
        return INVESTOR.length;
    }
    
    function locateInvestor(address addr) returns (uint) {
        for (uint i=0;i<INVESTOR.length;i++) {
            if (INVESTOR[i] == addr) {
                return i;
            }
        }
    }
    
    function gambling() {
        OWNER = msg.sender;
    }
    
    function () payable onlyWithValue {
		if (msg.value != )
        if (isInvestor(msg.sender)) {
            INVESTING_LIST[msg.sender] += msg.value;
        } else {
            INVESTING_LIST[msg.sender] = msg.value;
            INVESTOR.push(msg.sender);
        }
        BALANCE += msg.value;
    }

    function withdraw() onlyInvestor {
        msg.sender.transfer(INVESTING_LIST[msg.sender]);
        BALANCE -= INVESTING_LIST[msg.sender];
        delete INVESTOR[locateInvestor(msg.sender)];
        delete INVESTING_LIST[msg.sender];
    }
    
    function shutdown() onlyOwner {
        for (uint i=0;i<INVESTOR.length;i++) {
            INVESTOR[i].transfer(INVESTING_LIST[INVESTOR[i]]);
        }
        suicide(msg.sender);
    }
}