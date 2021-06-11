
const http = require('http');
const path = require('path')
const express = require('express')
const fs = require('fs')
const hostname = '127.0.0.1';
let port = 3000;
const wrote_file = path.resolve(__dirname, 'iconFolderPath')
const IconFolderPath = fs.readFileSync(wrote_file, { encoding: 'utf-8' })
const folderPath = IconFolderPath
const util = require('util');


const readdir = util.promisify(fs.readdir);
async function readIconDir(){
    let svgs = []
    let data = await readdir(folderPath)
    data.sort()
    data.map(fileName => {
      if(!fileName.startsWith('.'))
      svgs.push({
        name:fileName.split('.')[0],
        static_url:path.join('static', fileName),
        absolute_url:path.join(folderPath, fileName)
      })
    })
    return svgs
}

const app = new express();
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.get('/', function(request, response){
    response.render('index.ejs')
    // response.sendFile(path.join(__dirname+'/index.html'));
  
});
app.get('/icons', function(request, response){
  readIconDir().then((data)=>{
    response.setHeader('Content-Type', 'application/json');
    response.json({icons:data})
  })

});
app.use('/static', express.static(folderPath))
app.use('', express.static(__dirname))

app.listen(port)
console.log(`Running at http://localhost:${port}`);