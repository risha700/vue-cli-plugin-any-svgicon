const path = require('path')
const express = require('express')
const fs = require('fs')
const { copyFile, unlink, stat, rename } = require('fs/promises')
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

function getBaseIconPath(iconObj){
  if (typeof iconObj==='string'){
    let arr = iconObj.split('/')
    return arr.pop(arr.length-1);
    }
  let new_path = iconObj.absolute_url.split('/')
  new_path.pop(new_path.length-1)
  new_path = new_path.join('/')
  return new_path
}
function updateIconMarkup(iconObj, new_path){
  let fileName  = getBaseIconPath(new_path)
  return {
    name:fileName.split('.')[0],
    static_url:path.join('static', fileName),
    absolute_url:new_path,
    src:iconObj.src
  }
}
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

async function calculateFolderSize(dirPath){
  let total_size=0
  let data = fs.readdirSync(dirPath)
  data.forEach((item)=>{
    let stats = fs.statSync(dirPath+'/'+item)
    total_size+= stats.size
  })

  return [Number(total_size), data.length]
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
    response.setHeader('Cache-control', 'stale-while-revalidate=300')

    response.json({icons:data})
  })
});

app.get('/src', function(request, response){
  readIconDir(MoreSvgPath, true).then((data)=>{
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-control', 'stale-while-revalidate=300')

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

app.get('/stats', async function(request, response){
  let data = await calculateFolderSize(SpriteBundlePath)
  response.setHeader('Content-Type', 'application/json');
  response.json({size:data[0], count:data[1]})

});

app.post('/rename',jsonParser, function(request, response){
  const {data} = request.body
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Accept', 'application/json');
  let new_path = path.join(getBaseIconPath(data.icon), `${data.new_name}.svg`) 
  rename(data.icon.absolute_url, new_path).then(()=>{
    response.json({status:'ok', payload:updateIconMarkup(data.icon, new_path)})
  }).catch(e=>response.json({status:`something went wrong! ${e}`}))


});
const cache_options={
  setHeaders:(response, path)=>{
    response.setHeader('Cache-Control', 'static, max-age=300')
    response.setHeader('Accept', 'application/json');
    response.setHeader('Accept', 'application/json');
  }
  }

app.use('/static', express.static(SpriteBundlePath, cache_options))
app.use('/static', express.static(MoreSvgPath, cache_options))
app.use('/IconsUtils', express.static(path.join(__dirname, 'IconsUtils.js')))

app.use('', express.static(__dirname))
app.listen(port)
console.log(`Running at http://${hostname}:${port}`)