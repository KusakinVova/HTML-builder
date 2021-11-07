const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');


const filename = 'text.txt';
const file = path.join(__dirname, filename);
const writeableStream = fs.createWriteStream(file);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('I\'ll write your text in ' + file);
console.log('IF you finish pleace write \'exit\' or click Ctrl+C ');
console.log('-------------------------------');

rl.on('line', function (line) {
  if (line.toLowerCase().trim() === 'exit') rl.close();
  else {
    writeableStream.write(`${line}\n`);
    rl.prompt();
  }
});
rl.prompt();