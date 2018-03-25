pragma solidity ^0.4.17;

contract NineLivesTestContract {
    
    mapping (uint256 => Kitty) liveKitties;
    uint256[] kittyIds;
    
    struct Kitty {
        uint256 id;
        uint8 lives;
        bool isReadyToBattle;
    }
   
    function spawnKitty(uint256 _id)
        external
    {
        require(liveKitties[_id].id == 0);
    
        var kitty = liveKitties[_id];
        kitty.id = _id;
        kitty.lives = 10;
        kitty.isReadyToBattle = false;
        kittyIds.push(_id);
    }
    
    function decrementLives(uint256 _id)
        external
        kittyExists(_id)
    {
        require(liveKitties[_id].lives > 1);
        
        liveKitties[_id].lives--;
    }
    
    function setReadyToBattle(uint256 _id, bool _isReadyToBattle) 
        external
        kittyExists(_id)
    {
        
        liveKitties[_id].isReadyToBattle = _isReadyToBattle;
    }
      
    function getKittyInfo(uint256 _id)
        external
        view
        returns (
            uint8 lives,
            bool isReadyToBattle
        )
    {
        require(liveKitties[_id].id != 0);
        
        return (liveKitties[_id].lives, liveKitties[_id].isReadyToBattle);
    }
   
    function getKittyLives(uint256 _id)
        external
        view
        kittyExists(_id)
        returns (uint8 lives) 
    {
        
        return liveKitties[_id].lives;
    }
    
    function isReadyToBattle(uint256 _id) 
        external
        view
        kittyExists(_id)
        returns (bool isReady)
    {
        
        return liveKitties[_id].isReadyToBattle;
    }

    modifier kittyExists(uint _kittyId) {
        require(liveKitties[_kittyId].id != 0);
        _;
    }
    
}