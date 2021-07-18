const path = require('path')
const express = require('express')
const fs = require('fs')
const { copyFile, unlink } = require('fs/promises')
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
const hostname = '127.0.0.1';
let port = 3000;

let SpriteBundlePath
let MoreSvgPath


function setSvgFolderPath(){
  SpriteBundlePath =  process.argv[2]
  MoreSvgPath = process.argv[3]
}
setSvgFolderPath()

const util = require('util');


const readdir = util.promisify(fs.readdir);
async function readIconDir(folderPath, src){
    let svgs = []
    let data = await readdir(folderPath)
    data.sort()
    data.map(fileName => {
      if(!fileName.startsWith('.'))
      svgs.push({
        name:fileName.split('.')[0],
        static_url:path.join('static', fileName),
        absolute_url:path.join(folderPath, fileName),
        src:src
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
  readIconDir(SpriteBundlePath, false).then((data)=>{
    response.setHeader('Content-Type', 'application/json');
    response.json({icons:data})
  })
});

app.get('/src', function(request, response){
  readIconDir(MoreSvgPath, true).then((data)=>{
    response.setHeader('Content-Type', 'application/json');
    response.json({src_icons:data})
  })

});
app.post('/import',jsonParser, async function(request, response){
  const {data} = request.body
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Accept', 'application/json');
  copyFile(data.absolute_url, SpriteBundlePath+`/${data.name}.svg`).then(()=>{
    response.json({status:'ok'})
  }).catch(e=>response.json({status:'something went wrong!'}))

});
app.post('/delete',jsonParser, async function(request, response){
  const {data} = request.body
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Accept', 'application/json');
  unlink(data.absolute_url).then(()=>{
    response.json({status:'ok'})
  }).catch(e=>response.json({status:'something went wrong!'}))

});


app.use('/static', express.static(SpriteBundlePath))
app.use('/static', express.static(MoreSvgPath))

app.use('', express.static(__dirname))
app.listen(port)
console.log(`Running at http://${hostname}:${port}`)