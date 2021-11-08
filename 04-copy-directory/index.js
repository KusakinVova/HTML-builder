const fsPromises = require('fs').promises;
const path = require('path');

const src = path.join(__dirname, '/files');
const dest = path.join(__dirname, '/files-copy');

async function copyDir(src,dest) {
  const entries = await fsPromises.readdir(src, {withFileTypes: true});
  await fsPromises.rm(dest, { recursive: true, force: true });
  await fsPromises.mkdir(dest);
  for(let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

copyDir(src,dest);