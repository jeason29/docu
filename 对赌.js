pragma solidity ^0.4.13;

contract gambling {
    
    uint256 public BALANCE;
	uint256 public BET;
    address public OWNER;
    mapping (address => uint256) public INVESTING_LIST;
    address[] public INVESTOR;
    mapping (address => uint256) public pour;
	 
    modifier onlyOwner() {
        if (msg.sender != OWNER) {
            revert();
        }
        _;
    }
    
    modifier onlyTwo() {
        if (INVESTOR.length < 2) {
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

    function isInvestor(address addr) constant returns (bool) {
        for (uint i=0;i<INVESTOR.length;i++) {
            if (INVESTOR[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
    function changeOwner(address new_owner) onlyOwner {
        OWNER = new_owner;
    }
    
    function investorCount() constant returns (uint) {
        return INVESTOR.length;
    }
    
    function gambling() {
        OWNER = msg.sender;
        BET = 10 ** 3;
    }
    
    function () payable onlyWithValue {
		if (msg.value != BET) revert();
		if (INVESTOR.length >=2) revert();
        if(msg.sender == INVESTOR[0] || msg.sender == INVESTOR[1] ) revert();
        INVESTING_LIST[msg.sender] += msg.value;
        BALANCE += msg.value;
        
    }
    
     function stake( uint256 num) {
		if (INVESTOR.length >2) revert();
        if(msg.sender == INVESTOR[0] || msg.sender == INVESTOR[1] ) {
            pour[msg.sender] = num;          
        }
    }

    function withdraw()  {
        if(msg.sender == INVESTOR[0] || msg.sender == INVESTOR[1] ) revert();
        if(INVESTING_LIST[msg.sender] > 0) {
        msg.sender.transfer(INVESTING_LIST[msg.sender]);
        }
        BALANCE -= INVESTING_LIST[msg.sender];
    }
    
    function lottery() onlyOwner {
        if(INVESTOR.length <2) revert();
        if (INVESTOR.length ==2) {
            if(pour[INVESTOR[0]]>pour[INVESTOR[1]]){
                INVESTOR[0].transfer(BALANCE);
            }
        }
    }   
    function shutdown() onlyOwner {
        for (uint i=0;i<INVESTOR.length;i++) {
		if(INVESTING_LIST[INVESTOR[i]]>0){
            INVESTOR[i].transfer(INVESTING_LIST[INVESTOR[i]]);
            }
        }
        suicide(msg.sender);
    }
}