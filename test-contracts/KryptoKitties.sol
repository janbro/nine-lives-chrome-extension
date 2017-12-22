pragma solidity ^0.4.18;

contract TestKittyContract {
    
    Kitty[] public kitties;
    
    struct Kitty {
        uint256 genes;

        uint64 birthTime;

        uint64 cooldownEndBlock;

        uint32 matronId;
        uint32 sireId;

        uint32 siringWithId;

        uint16 cooldownIndex;

        uint16 generation;
    }
   
    function createKitty(string _seed) public {
        uint _genes = uint(keccak256(_seed));
        uint64 _birthTime = uint64(keccak256(_genes));
        uint64 _cooldownEndBlock = uint64(keccak256(_birthTime));
        uint32 _matronId = uint32(keccak256(_cooldownEndBlock));
        uint32 _sireId = uint32(keccak256(_matronId));
        uint32 _siringWithId = uint32(keccak256(_sireId));
        uint16 _cooldownIndex = uint16(keccak256(_siringWithId));
        uint16 _generation = uint16(keccak256(_cooldownIndex));
        
        kitties.push(Kitty(_genes, _birthTime, _cooldownEndBlock, _matronId, _sireId, _siringWithId, _cooldownIndex, _generation));
    }
   
    function getKitty(uint256 _id)
        public
        view
        returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    ) {
        Kitty storage kit = kitties[_id % kitties.length];

        // if this variable is 0 then it's not gestating
        isGestating = (kit.siringWithId != 0);
        isReady = (kit.cooldownEndBlock <= block.number);
        cooldownIndex = uint256(kit.cooldownIndex);
        nextActionAt = uint256(kit.cooldownEndBlock);
        siringWithId = uint256(kit.siringWithId);
        birthTime = uint256(kit.birthTime);
        matronId = uint256(kit.matronId);
        sireId = uint256(kit.sireId);
        generation = uint256(kit.generation);
        genes = kit.genes;
    }
    
}