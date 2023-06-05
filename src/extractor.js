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
        let creatureArray = obj.value.match(/by (a |an )?(.+)/i);
        if(creatureArray !== null) {
            // Damage taken by creature
            let creature = creatureArray[2].trim().replace(/\.$/, '');
            creatures[creature].addDamageHitted(damageTaken[1]);
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
    } else if (obj.value.includes('hitpoints due to your attack')){
        // Acumulated damage hitted in creatures
        let damageHitted = obj.value.match(/(\d+) hitpoint(s)?/);
        let creatureArray = obj.value.match(/A(?:n)?\s(.*?)\sloses/);
        let creature = creatureArray[1];
        creatures[creature].addDamageTaken(damageHitted[1]);
    }
}

function addDrops(creatureDrops, creatureName, creatures){
    let dropName = '';
    // Criatura dropou mais de um item
    if(creatureDrops.length > 1){
        creatureDrops.forEach(lootString => {
            const splitedLoots = lootString.split(' ');
            // Nome do drop contém mais de 2 elementos
            if(splitedLoots.length > 3){
                // Drop não está no singular (começa com 'a') e não começa com um número
                if(!(Number.isInteger(parseInt(splitedLoots[0]))) && splitedLoots[0] !== 'a'){
                    for(i = 0; i < splitedLoots.length; i++){
                        dropName += splitedLoots[i];
                    }
                    dropName = dropName.replace(/[^\w\s]/gi, '');
                    creatures[creatureName].drops.add(dropName,1);
                } else {
                    for(i = 1; i < splitedLoots.length; i++){
                        dropName += splitedLoots[i];
                    }
                    // Drop está no singular ou começa com um número
                    if(splitedLoots[0] === 'a'){
                        dropName = dropName.replace(/[^\w\s]/gi, '');
                        creatures[creatureName].drops.add(dropName,1);
                    } else {
                        dropName = dropName.replace(/[^\w\s]/gi, '');
                        creatures[creatureName].drops.add(dropName,splitedLoots[0]);
                    }
                }
            } else { // Nome do drop não tem mais de 2 elementos
                // Drop não está no singular (começa com 'a') e não começa com um número
                if(!(Number.isInteger(parseInt(splitedLoots[0]))) && splitedLoots[0] !== 'a'){
                    for(i = 0; i < splitedLoots.length; i++){
                        dropName += splitedLoots[i];
                    }
                    dropName = dropName.replace(/[^\w\s]/gi, '');
                    creatures[creatureName].drops.add(dropName,1);
                } else { 
                    // Drop está no singular ou começa com um número
                    for(i = 1; i < splitedLoots.length; i++){
                        dropName += splitedLoots[i];
                    }
                    if(splitedLoots[0] === 'a'){
                        dropName = dropName.replace(/[^\w\s]/gi, '');
                        creatures[creatureName].drops.add(dropName,1);
                    } else {
                        dropName = dropName.replace(/[^\w\s]/gi, '');
                        creatures[creatureName].drops.add(dropName,splitedLoots[0]);
                    }
                }
            }
            dropName = '';
        });
    } else { // Criatura dropou apenas um item
        const splitedLoots = creatureDrops[0].split(' ');

        if(!(Number.isInteger(parseInt(splitedLoots[0]))) && splitedLoots[0] !== 'a'){
            // Drop não está no singular (começa com 'a') e não começa com um número
            for(i = 0; i < splitedLoots.length; i++){
                dropName += splitedLoots[i];
            }
            dropName = dropName.replace(/[^\w\s]/gi, '');
            creatures[creatureName].drops.add(dropName,1);
        } else { 
            // Drop está no singular ou começa com um número
            for(i = 1; i < splitedLoots.length; i++){
                dropName += splitedLoots[i];
            }
            dropName = dropName.replace(/[^\w\s]/gi, '');
            if(splitedLoots[0] === 'a'){
                creatures[creatureName].drops.add(dropName,1);
            } else {
                creatures[creatureName].drops.add(dropName,splitedLoots[0]);
            }
        }
        dropName = '';
    }
}

function extractor(parsedLog, finalAnalysisFile, userChar) {
    fs.readFile(parsedLog, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        try {
            const objetos = JSON.parse(data);

            // Extrair nome das criaturas
            const allCreaturesInServerLog = [];
            const regex = /A(?:n)?\s(.*?)\sloses/;

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

            const damageTakenByCreatureKind = {};
            const totalLoots = {};
            const allLootsByCreatureKind = {};

            for (let creature in creatures) {
                if(creatures[creature].damageHitted > 0){
                    const damageHitted = creatures[creature].damageHitted;
                    damageTakenByCreatureKind[creature] = damageHitted;
                }
                allLootsByCreatureKind[creature] = {};
                for(let drop in creatures[creature].drops){
                    if(totalLoots[drop] === undefined) totalLoots[drop] = 0;
                    if(creatures[creature].drops[drop] > 0){
                        totalLoots[drop] += parseInt(creatures[creature].drops[drop]);
                        allLootsByCreatureKind[creature][drop] = parseInt(creatures[creature].drops[drop]);
                    }
                }
            }

            for (let loot in totalLoots) {
                if (totalLoots[loot] === 0) {
                    delete totalLoots[loot];
                }
            }

            const lootsByCreatureKind = {};
            for(let creatureLoots in allLootsByCreatureKind){
                if(Object.keys(allLootsByCreatureKind[creatureLoots]).length > 0){
                    lootsByCreatureKind[creatureLoots] = allLootsByCreatureKind[creatureLoots];
                }
            }

            let filteredInfos = {
                "hitpointsHealed" : userChar.healedPoints,
                "damageTaken" : {
                    "total" : userChar.damageTaken,
                    "fromUnknownOrigins" : userChar.damageTakenFromUnknownOrigins,
                    "byCreatureKind" : damageTakenByCreatureKind,
                },
                "experienceGained" : userChar.receivedExperience,
                "loots" : {
                    "totalLoots" : totalLoots,
                    "byCreatureKind" : lootsByCreatureKind
                },
                "blackKnightTotalHealth" : creatures['Black Knight'].damageTaken
            };

            
            fs.writeFile(finalAnalysisFile, JSON.stringify(filteredInfos), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Arquivo JSON Com a analise do LOG gerado com sucesso!');
            });
            return

        } catch (error) {
            console.error('Erro ao processar o arquivo PARSED-LOG.JSON:', error);
            return
        }
    });
}

module.exports = extractor;