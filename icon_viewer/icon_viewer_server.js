
const http = require('http');
const path = require('path')
const express = require('express')
const fs = require('fs')
const hostname = '127.0.0.1';
let port = 3000;
const folderPath = path.join(__dirname, '../src/assets/svg_icons')

let svgIcons = []
fs.readdirSync(folderPath).map(fileName => {
        if(!fileName.startsWith('.'))
        // svgIcons.push(path.join(folderPath, fileName))
        svgIcons.push(path.join('static', fileName))
  })
  const app = new express();
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.get('/', function(request, response){
    
    // response.sendFile(path.join(__dirname+'/index.html'));
    response.render('index.ejs', {icons:svgIcons})
  
});
app.use('/static', express.static(folderPath))
app.use('', express.static(__dirname))

app.listen(port)
console.log(`Running at http://localhost:${port}`);