class Loots {
    constructor(){
        this.goldcoins = 0;             // Gold Coins
        this.cyclopstrophy = 0;         // Cyclops Trophy
        this.cyclopstoe = 0;            // Cyclops Toe
        this.meat = 0;                  // Meat
        this.hatchet = 0;               // Hatchet
        this.letter = 0;                // Letter
        this.coppershield = 0;          // Copper Shield
        this.leatherlegs = 0;           // Leather Legs
        this.bolt = 0;                  // Bolt
        this.soldierhelmet = 0;         // Soldier Helmet
        this.whitemushroom = 0;         // White Mushroom
        this.pick = 0;                  // Pick
        this.dragonham = 0;             // Dragon Ham
        this.platelegs = 0;             // Plate Legs
        this.stronghealthpotion = 0;    // Strong Health Potion    
        this.steelshield = 0;           // Steel Shield
        this.crossbow = 0;              // Crossbow
        this.greendragonleather = 0;    // Green Dragon Leather
        this.steelhelmet = 0;           // Steel Helmet
        this.smalldiamond = 0;          // Small Diamond
        this.burstarrow = 0;            // Burst Arrow
        this.dragonstail = 0;           // Dragons Tail
        this.royalspear = 0;            // Royal Spear
        this.longsword = 0;             // Longsword
        this.scorpiontail = 0;          // Scorpion Tail
        this.spellbook = 0;             // Spell Book
        this.twohandedsword = 0;        // Two Handed Sword

        this.add = (attr, qty) => {
            if (this.hasOwnProperty(attr)) {
                this[attr] += parseInt(qty);
            }
        };
    }

} module.exports = Loots;