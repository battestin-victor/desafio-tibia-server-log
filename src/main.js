const UserChar = require('./UserChar');
const parseTibiaLog = require('./logToJsonParser');
const extractor = require('./extractor');

const userChar = new UserChar();

/*
    - Converter o Log de txt para Json
    - Verifico as criaturas existentes no LOG e crio um array de criaturas
    - 
*/

// Conversão do log em um arquivo json para tratar os dados
parseTibiaLog('files/log-files/Server-Log.txt', 'files/result-files/parsed-log.json');

// Extrair as informações do log parseado e criar o json final com as informações
const finalAnalisys = extractor('files/result-files/parsed-log.json', userChar);

console.log(finalAnalisys);