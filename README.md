## Any-Svgicon vue cli plugin
***
### 
Is not an icon library, it is a tool to generate sprite svg from icons you will choose, although it generates heroicons collection as a starter.

## Advantages :
 - easy install "No need to setup webpack configuration".
 - ready to use vue component.
 - preview for all icons locally from your command line

 ## Installation
 ```
vue add any-svgicon
 ```
 this will install, invoke the plugin and leave you with svg-icon.config.js and .env file in your root directory for any special webpack setup, additionally adds the SvgIcon component to components directory.


 ## Next:
-  You will be propmt to choose a folder name (relative to src/assets) to place your chosen svg icons that will be  available for you to include in your vue project

- Add some icon files you pick to the icons folder
### note: 
all svg icons in the icons folder will be bundled and injected in main.js webpack context.

### Tip:
 clean icons width and height is optional but recommended "you control it with css later", use the following script inside icons folder
```
foreach f in `ls`;do sed -E -i '' 's/width=.{4} height=.{4}/ /' $f ;done
```
## preview your chosen icons

```
npm run icons
```
Will open up a friendly interface on port 3000 to search and choose from.

![icon_preview](readme-assets/icon_preview.png)
## usage:
```
<SvgIcon icon-name='whatevername'/>

available props:
className:string
outline:boolean
// normally will use solid version of the icon and clean its attributes with svgo and  
//then  reapply styles with css

```
### Credits
* svg-sprite-loader
* svgo

## Licensce:
MIT 