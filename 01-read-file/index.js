const fs = require('fs');
const path = require('path');
const process = require('process');

const filename = 'text.txt';

//fs.ReadStream наследует от stream.Readable
let stream = new fs.ReadStream(path.join(__dirname, filename), 'utf8');
stream.on('readable', function(){  
  let data = stream.read();
  if(data) process.stdout.write(data);
});

// имя файла выведется в консоль раньше 
// console.log(filename);