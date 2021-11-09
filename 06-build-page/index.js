const fsPromises = require('fs').promises;
const path = require('path');



async function createBundle(file, dirstyle){
  const entries = await fsPromises.readdir(dirstyle, {withFileTypes: true});
  if(entries.length === 0) return false;
  await fsPromises.writeFile(file, '');
  for(let entry of entries) {
    if(entry.isFile() && path.parse(entry.name).ext.slice(1) === 'css') {
      const data = await fsPromises.readFile(path.join(dirstyle, entry.name));
      await fsPromises.appendFile(file, data);
    }
  }
  console.log(`I created bundle ${file}`);
}

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
  console.log(`I copied ${src}`);
}

async function buildLayout(nameLayout, sourceTemplate, sourceComponents){
  let template = await fsPromises.readFile(sourceTemplate, { encoding: 'utf8' });
  const components = await fsPromises.readdir(sourceComponents, {withFileTypes: true});
  for(let component of components) {
    let name = path.parse(component.name).name;
    let ext = path.parse(component.name).ext.slice(1);
    if(component.isFile() && ext === 'html' && template.includes(`{{${name}}}`) ) {
      const data = await fsPromises.readFile(path.join(sourceComponents, component.name), { encoding: 'utf8' });
      template = await template.replace(`{{${name}}}`, data);
    }
  }
  await fsPromises.writeFile(nameLayout, template);
  console.log(`I created layout ${nameLayout}`);
}


async function buildProject(dirProject, nameLayout, nameStyle, nameAssetsDir){
  if(dirProject == undefined) dirProject = path.join(__dirname, 'project-dist');
  if(nameLayout == undefined) nameLayout = path.join( dirProject, 'index.html');
  if(nameStyle == undefined) nameStyle = path.join(dirProject, 'style.css');
  if(nameAssetsDir == undefined) nameAssetsDir = path.join(dirProject, 'assets');
  
  const dirAssetsSource = path.join(__dirname, 'assets');
  const dirStylesSource = path.join(__dirname, 'styles');
  const sourceComponents = path.join(__dirname, 'components');
  const sourceTemplate = path.join(__dirname, 'template.html');

  await fsPromises.rm(dirProject, { recursive: true, force: true });
  await fsPromises.mkdir(dirProject);
  await buildLayout(nameLayout, sourceTemplate, sourceComponents);
  await createBundle(nameStyle, dirStylesSource);
  await copyDir(dirAssetsSource,nameAssetsDir);

  console.log(`\nI created Project ${dirProject}`);
}

buildProject();