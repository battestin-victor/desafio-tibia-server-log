const fs = require('fs');

function eventFilter(obj, userChar, userDrops){

    if(obj.value.includes('healed yourself')){
        // Healed Hitpoints
        let healedHitpoints = obj.value.match(/(\d+) hitpoints/);
        userChar.addHealedPoints(healedHitpoints[1]);
    } else if (obj.value.includes('You lose')){
        // Total Damage taken
        let damageTaken = obj.value.match(/(\d+) hitpoint(s)?/);
        userChar.addDamageTaken(damageTaken[1]);
        let creature = obj.value.match(/by\s+(a|an)\s+(\w+)/i);
        if(creature !== null){
            // Damage taken by creature
            switch(creature[2]){
                case 'cyclops':
                    userChar.addDamageTakenByCyclops(damageTaken[1]);
                    break;
                case 'ghoul':
                    userChar.addDamageTakenByGhoul(damageTaken[1]);
                    break;
                case 'dwarf':
                    userChar.addDamageTakenByDwarf(damageTaken[1]);
                    break;
                case 'dragon':
                    userChar.addDamageTakenByDragon(damageTaken[1]);
                    break;
                case 'wyvern':
                    userChar.addDamageTakenByWyvern(damageTaken[1]);
                    break;
                case 'scorpion':
                    userChar.addDamageTakenByScorpion(damageTaken[1]);
                    break;
                case 'bonelord':
                    userChar.addDamageTakenByBonelord(damageTaken[1]);
                    break;
                case 'Black':
                    userChar.addDamageTakenByBlackKnight(damageTaken[1]);
                    break;
                default:
                    break;
            }
        } else {
            // Damage taken from unknown origins
            userChar.addDamageTakenFromUnknownOrigins(damageTaken[1]);
        }
    } else if (obj.value.includes('experience points')){
        // Total Exp received
        let expGained = obj.value.match(/(\d+) experience/);
        if (expGained !== null){
            userChar.addReceivedExp(expGained[1]);
        }
    } else if (obj.value.includes('Loot of')){
        // Loots by creature
        let creature = obj.value.match(/Loot of a (\w+):/);
        const drops = obj.value.match(/\s+(\d+)\s+(\w+)\s+/);
        if(creature !== null){
            switch(creature[1]){
                case 'cyclops':
                    if(drops !== null){
                        const match = obj.value.match(/Loot of a \w+:\s(.+)/);
                        
                        if (match && match[1]) {
                            const lootsString = match[1];
                            const loots = lootsString.split(',').map(loot => loot.trim());
                            console.log(loots);
                        } else {
                            console.log('Loots não encontrados');
                        }
                    }
                    break;
                case 'ghoul':
                    //global.totalDamageByGhoul += parseInt(damageTaken[1]);
                    break;
                case 'dwarf':
                    //global.totalDamageByDwarf += parseInt(damageTaken[1]);
                    break;
                case 'dragon':
                    //global.totalDamageByDragon += parseInt(damageTaken[1]);
                    break;
                case 'wyvern':
                    //global.totalDamageByWyvern += parseInt(damageTaken[1]);
                    break;
                case 'scorpion':
                    //global.totalDamageByScorpion += parseInt(damageTaken[1]);
                    break;
                case 'bonelord':
                    //global.totalDamageByBonelord += parseInt(damageTaken[1]);
                    break;
                case 'Black':
                    //global.totalDamageByBlackKnight += parseInt(damageTaken[1]);
                    break;
                default:
                    break;
            }
        }
    }
}

function extractor(parsedLog, userChar, userDrops) {
    fs.readFile(parsedLog, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        try {
            const objetos = JSON.parse(data);

            const nomesCriaturas = [];
            const regex = /Loot of a (.+?):/;

            for (const string of objetos) {
                const match = string.value.match(regex);

                if (match && match[1]) {
                    const nomeCriatura = match[1];
                    nomesCriaturas.push(nomeCriatura);
                }
            }
            const arraySemDuplicatas = Array.from(new Set(nomesCriaturas));
            console.log(arraySemDuplicatas);

            objetos.forEach(obj => {
                eventFilter(obj, userChar, userDrops);
            });

            let filteredInfos = {}

            return filteredInfos

        } catch (error) {
            console.error('Erro ao processar o arquivo JSON:', error);
            return 
        }
    });
} 
module.exports = extractor;