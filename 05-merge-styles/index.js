const fsPromises = require('fs').promises;
const path = require('path');

// ------------------------------------------
const dirstyle = path.join(__dirname, '/styles');
const bundle = 'project-dist/bundle.css';
const bundle_path = path.join(__dirname, bundle);
// ------------------------------------------

async function createBundle(file, dirstyle){
  const entries = await fsPromises.readdir(dirstyle, {withFileTypes: true});
  await fsPromises.writeFile(file, '');
  for(let entry of entries) {
    if(entry.isFile() && path.parse(entry.name).ext.slice(1) === 'css') {
      const data = await fsPromises.readFile(path.join(dirstyle, entry.name));
      await fsPromises.appendFile(file, data);
    }
  }
}

createBundle(bundle_path, dirstyle);