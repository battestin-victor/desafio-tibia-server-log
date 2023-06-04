const fs = require('fs');

function logToJsonParser (inputFile, outputFile) {

    // Ler o arquivo de texto
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    
      // Dividir o conteúdo do arquivo em linhas
      const linhas = data.split('\n');
    
      // Mapear cada linha para um objeto JSON
      const objetos = linhas
        .filter((linha) => linha.trim() !== '') // Filtrar linhas vazias
        .map((linha) => {
          return { 'value' : linha };
      });
    
      // Converter o array de objetos em uma string JSON
      const json = JSON.stringify(objetos, null, 2);
    
      // Escrever o JSON em um arquivo
      fs.writeFile(outputFile, json, 'utf8', (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Arquivo JSON gerado com sucesso!');
      });
    });
}

module.exports = logToJsonParser;