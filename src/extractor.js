const fs = require('fs');
const Creature = require('./Creature');

function eventFilter(obj, userChar, creatures){

    if(obj.value.includes('healed yourself')){
        // Healed Hitpoints
        let healedHitpoints = obj.value.match(/(\d+) hitpoints/);
        userChar.addHealedPoints(healedHitpoints[1]);
    } else if (obj.value.includes('You lose')){
        // Total Damage taken
        let damageTaken = obj.value.match(/(\d+) hitpoint(s)?/);
        userChar.addDamageTaken(damageTaken[1]);
        let creature = obj.value.match(/by\s+(a|an)\s+(\w+)/i);
        if(creature !== null) {
            // Damage taken by creature
            creatures[creature[2]].addDamageHitted(damageTaken);
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

        // Remove o prefixo 'Loot of a' da string
        const unprefixedObjectValue = obj.value.replace('Loot of a', '');
        // Divide a string em duas partes: antes e depois dos loots
        const [_, filteredCreatureName, filteredLoots] = unprefixedObjectValue.match(/([^:]+):\s(.+)/);
        // Remove os números e espaços antes das letras no lootParte1
        const creatureName = filteredCreatureName.replace(/^\d+\s*/, '').trim();
        // Separa os loots em um array
        const loots = filteredLoots.split(',');
        const creatureDrops = loots.map(loot => loot.trim());

        if(creatureName !== null){
            if(creatureDrops !== null && creatureDrops[0] !== 'nothing.'){
                addDrops(creatureDrops, creatureName, creatures);
            }
        }
    }
}

function addDrops(creatureDrops, creatureName, creatures){
    let dropName = '';
    if(creatureDrops.length > 1){
        creatureDrops.forEach(lootString => {
            const splitedLoots = lootString.split(' ');
            for(i = 1; i < splitedLoots.length; i++){
                dropName += splitedLoots[i];
            }
            if(splitedLoots.length > 3){
                if(splitedLoots[0] === 'a'){
                    creatures[creatureName].drops.add(dropName,1);
                } else {
                    creatures[creatureName].drops.add(dropName,splitedLoots[0]);
                }
            } else {
                if(splitedLoots[0] === 'a'){
                    creatures[creatureName].drops.add(dropName,1);
                } else {
                    creatures[creatureName].drops.add(dropName,splitedLoots[0]);
                }
            }
        });
    } else {
        const splitedLoots = creatureDrops[0].split(' ');
        for(i = 1; i < splitedLoots.length; i++){
            dropName += splitedLoots[i];
        }
        dropName = dropName.replace(/[^\w\s]/gi, '');
        creatures[creatureName].drops.add(dropName,splitedLoots[0]);
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

            // Extrair nome das criaturas
            const allCreaturesInServerLog = [];
            const regex = /Loot of a (.+?):/;

            for (const string of objetos) {
                const match = string.value.match(regex);

                if (match && match[1]) {
                    const nomeCriatura = match[1];
                    allCreaturesInServerLog.push(nomeCriatura);
                }
            }
            const creaturesNamesArray = Array.from(new Set(allCreaturesInServerLog));

            // Criar um array de criaturas existentes no log
            const creatures = creaturesNamesArray.reduce((obj, name) => {
                const creature = new Creature(name);
                obj[creature.name] = creature;
                return obj;
            }, {});

            // filtrar, preencher e salvar os eventos 
            objetos.forEach(obj => {
                eventFilter(obj, userChar, creatures);
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