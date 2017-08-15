pragma solidity ^0.4.13;

contract gambling {
    
    uint256 public BALANCE;
	uint256 public BET;
    address public OWNER;
    mapping (address => uint256) public INVESTING_LIST;
    address[] public INVESTOR;
    mapping (address => uint256) public pour;
    uint public people_num;
	 
    modifier onlyOwner() {
        if (msg.sender != OWNER) {
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
      
    function gambling() {
        OWNER = msg.sender;
        BET = 10 ** 3;
        people_num = 0;
    }
    
    function () payable onlyWithValue {
		if (msg.value != BET) revert();
		if (people_num >=2) revert();
        if(msg.sender == INVESTOR[0] || msg.sender == INVESTOR[1] ) revert();
        INVESTING_LIST[msg.sender] = msg.value;
		INVESTOR[people_num] = msg.sender;
        BALANCE += msg.value;
        people_num++;
        
    }
    
     function stake( uint256 num) {
		if (people_num !=2) revert();
        if(msg.sender == INVESTOR[0] || msg.sender == INVESTOR[1] ) {
            pour[msg.sender] = num;          
        }
    }
 
     function lottery() onlyOwner {
        if(people_num <2) revert();
        if (people_num ==2) {
            if(pour[INVESTOR[0]]>pour[INVESTOR[1]]){
                INVESTOR[0].transfer(BALANCE);
            }
        }
		people_num = 0;
		INVESTOR[0] = OWNER;
		INVESTOR[1] = OWNER;
    } 
    
    function withdraw()  {
        if(msg.sender != INVESTOR[0] && msg.sender != INVESTOR[1] ) revert();
        if(INVESTING_LIST[msg.sender] > 0) {
        msg.sender.transfer(INVESTING_LIST[msg.sender]);
        }
        BALANCE -= INVESTING_LIST[msg.sender];
		people_num--;
		if(msg.sender == INVESTOR[0]) {
			INVESTOR[0] = OWNER;
		}
		if(msg.sender == INVESTOR[1]) {
			INVESTOR[1] = OWNER;
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