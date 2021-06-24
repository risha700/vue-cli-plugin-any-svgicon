const path = require('path')
const express = require('express')
const fs = require('fs')
const hostname = '127.0.0.1';
let port = 3000;


function getSvgFolderPath(){
  const env_loc = `${path.resolve(path.join(__dirname, '../.env'))}`
  const env_contents = fs.readFileSync(env_loc, { encoding: 'utf-8' })
  const lines = env_contents.split(/\r?\n/g)
  const icon_path = lines.findIndex(line => line.match(/(VUE_APP_SVG_FOLDERPATH)/))
  return lines[icon_path].split('=')[1]
}

const folderPath = getSvgFolderPath()
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
console.log(`Running at http://${hostname}:${port}`);