pragma solidity ^0.4.18;

contract NineLivesTestContract {
    
    mapping (uint256 => Kitty) liveKitties;
    uint256[] kittyIds;
    
    struct Kitty {
        uint256 id;
        uint8 lives;
    }
   
    function spawnKitty(uint256 _id) public {
        if(liveKitties[_id].id == 0) {
            var kitty = liveKitties[_id];
            kitty.id = _id;
            kitty.lives = 10;
            kittyIds.push(_id);
        }
        else {
            revert();
        }
    }
   
    function getKittyLives(uint256 _id)
        public
        view
        returns (
        uint8 lives
    ) {
        if(liveKitties[_id].id == 0) {
            return 0;
        }
        return liveKitties[_id].lives;
    }
    
    function decrementLives(uint256 _id)
        public
    {
        if(liveKitties[_id].lives > 1) {
            liveKitties[_id].lives--;
        }
    }
    
}