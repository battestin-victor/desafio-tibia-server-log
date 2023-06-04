class UserChar {
    constructor(){
        this.healedPoints = 0;
        this.damageTaken = 0;
    }

    addHealedPoints(healedPoints){
        this.healedPoints += parseInt(healedPoints);
    }

    addDamageTaken(dmg) {
        this.damageTaken += parseInt(dmg);
    }

}

module.exports = UserChar;