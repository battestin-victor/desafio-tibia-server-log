const Loots = require('./Loots');

class Creature {
    constructor(name){
        this.name = name;
        this.damageHitted = 0;
        this.damageTaken = 0;
        this.drops = new Loots();
    }


}

module.exports = Creature;