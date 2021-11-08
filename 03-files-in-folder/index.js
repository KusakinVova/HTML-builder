const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

function readDir(dir){
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if(err) return err;
    files.forEach(file => {
      let file_path = path.join(dir,file.name);
      if(file.isDirectory()){
        readDir(file_path);
      }
      else{
        fs.stat(file_path, (err, stat) => {
          if(err) return err;
          let name = path.parse(file.name).name;
          let ext = path.parse(file.name).ext.slice(1);
          let filesize = stat.size;
          filesize = filesize < (10**3) ? `${filesize}b` : filesize > (10**6) ? `${filesize / (10**6) }mb` : `${filesize / (10**3) }kb`;
          console.log(`${name} - ${ext} - ${filesize} `);
        });
        
      }
    });
  });
}

readDir(dir);
