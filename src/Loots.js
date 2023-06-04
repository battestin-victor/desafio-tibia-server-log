class Loots {
    constructor(){
        this.gold = 0;              // Gold
        this.trophy = 0;            // Cyclops Trophy
        this.toe = 0;               // Cyclops Toe
        this.meat = 0;              // Meat
        this.hatchet = 0;           // Hatchet
        this.letter = 0;            // Letter
        this.copper = 0;            // Copper Shield
        this.leather = 0;           // Leather Legs
        this.bolt = 0;              // Bolt
        this.soldier = 0;           // Soldier Helmet
        this.mushroom = 0;          // White Mushroom
        this.pick = 0;              // Pick
        this.ham = 0;               // Dragon Ham
        this.plate = 0;             // Plate Legs
        this.potion = 0;            // Strong Health Potion    
        this.shield = 0;            // Steel Shield
        this.crossbow = 0;          // Crossbow
        this.green = 0;             // Green Dragon Leather
        this.helmet = 0;            // Steel Helmet
        this.diamond = 0;           // Small Diamond
        this.burst = 0;             // Burst Arrow
        this.dragons = 0;           // Dragons Tail
        this.spear = 0;             // Royal Spear
        this.longsword = 0;         // Longsword
        this.scorpion = 0;          // Scorpion Tail
        this.spellBook = 0;         // Spell Book
        this.handed = 0;            // Two Handed Sword

        this.add = (attr, qty) => {
            if (this.hasOwnProperty(attr)) {
                this[attr] += parseInt(qty);
            }
        };
    }

} module.exports = Loots;