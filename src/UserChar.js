class UserChar {
    constructor(){
        this.healedPoints = 0;
        this.damageTaken = 0;
        this.damageTakenFromUnknownOrigins = 0;
        this.receivedExperience = 0;
    }

    addHealedPoints(healedPoints){
        this.healedPoints += parseInt(healedPoints);
    }

    addDamageTaken(dmg){
        this.damageTaken += parseInt(dmg);
    }

    addDamageTakenFromUnknownOrigins(dmg){
        this.damageTakenFromUnknownOrigins += parseInt(dmg);
    }

    addReceivedExp(exp){
        this.receivedExperience += parseInt(exp);
    }

}

module.exports = UserChar;