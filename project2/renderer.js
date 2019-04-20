const PIXI = require('pixi.js');
const system = require('./fileSystem.js');
const fs = require('fs');
const hide = require('hidefile');
const path = require('path');


selected = [];
selectedPath = null;

/*  
*   each object will be given a color from this
*   dictionary
*/
colorDict = {
    'dir':   0x89CEF0,
    'file': 0xFFA48C,
    'pic': 0xFFDF8C,
    'bin': 0x939FF2,
    'else': 0x86F3B5
};
/*
* text style for all rendered text
*/
const style = new PIXI.TextStyle({
    fontFamily: 'Monospace',
    fontSize: 14,
    wordWrap: true,
    wordWrapWidth: 15
})
/*
*   Initialize the renderer engine and append to doc
*/
function Init(){

    let elem = document.getElementById('treeview');

    app = new PIXI.Application({
        width: 850,
        height: 600,
        backgroundColor: 0xeeeeee,
        antialias: true,
        transparent: false,
        forceCanvas: true,
        resolution: window.devicePixelRatio || 1,
    });

    elem.appendChild(app.view);

    container = new PIXI.Container();
    app.stage.addChild(container);
    container.x = 0;
    container.y = 0;
}

function createObjects(files, homedir){

    
    /*
    *   Calcualte non hidden files
    */
    let available = [];
    files.forEach(file => {

     let result = hide.shouldBeHiddenSync( path.join(homedir,file))

        if(!result){
            available.push(file);
        }
    
    })
   
    /*
    *   If we have enough files to more that
    *   one row we set the width accordingly 
    */
    if(available.length > 6){
        rectWidth = app.view.width / 7;
    }else {
        rectWidth = app.view.width / available.length;
    }
    
    rectHeight = app.view.height / Math.ceil(available.length/7);
    i = 0;
    j = 0;
 
    files.forEach(file => {
     
        /*
        * create rectangle object
        */

        hide.shouldBeHidden( path.join(homedir,file),(err,result) => {
        
       
            if(err !== null) throw err;

            if(!result){

                let rect = new PIXI.Graphics();
                
                if(fs.statSync(path.join(homedir,file)).isDirectory()) {
                    rect.beginFill(colorDict['dir'],1);
                    rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                    rect.endFill();
                }
                else{

                    if(file.toString().match(/exe/)){
                        rect.beginFill(colorDict['bin'],1)
                        rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                        rect.endFill();
                    }
                    else if(file.toString().match(/jpg|jpeg|png|gif/)){
                        rect.beginFill(colorDict['pic'],1)
                        rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                        rect.endFill();
                    }
                    else if(file.toString().match(/mov|mp4|wmv|avi/)){
                        rect.beginFill(colorDict['file'],1);
                        rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                        rect.endFill();
                    }
                    else if(file.toString().match(/pdf/)){
                        rect.beginFill(colorDict['file'],1);
                        rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                        rect.endFill();
                    }
                    else if(file.toString().match(/txt/)){
                        rect.beginFill(colorDict['file'],1);
                        rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                        rect.endFill();
                    }
                    else{
                        rect.beginFill(colorDict['else'],1);
                        rect.drawRect((i) * rectWidth, j * rectHeight, rectWidth,rectHeight);
                        rect.endFill();
                    }
                
                    
               }
                rect.interactive = true;
                rect.buttonMode = true;

                /*
                *   create text object
                */
                if(file.length > 20){
                    str = file.substring(0,10);
                }
                else{
                    str = file;
                }
                let text = new PIXI.Text(str, style);
                text.anchor.set(0.5,0.5);
                
                text.x = ((i) * rectWidth) + (rectWidth/2);
                text.y = (j * rectHeight) + (rectHeight/2);
                
                /*
                *    button bindings
                */
                rect.mouseover = function(mouseData){
                    this.alpha = .5;
                }
                rect.mouseout = function(mouseData){
                    this.alpha = 1;
                }
                
                rect.on('rightdown', highlightObject.bind(undefined, path.join(homedir,file), rect));
                
                rect.on('click', system.clickEvent.bind(undefined, path.join(homedir,file)))
                
                /*
                *append created object to container
                */
                container.addChild(rect);
                container.addChild(text);
            
                if(i > 6){
                    i = 0;
                    j += 1;
                }else {
                    i += 1;
                }
            }
         });
    });
   
    

 
 
}


/*
* keeps only one highlighted object in scope at a time
* changes tint of box to show difference
*/
function highlightObject(path, btn){

    if(selected.length >= 1){
        let deselect = selected.pop();
        deselect.tint = 0xFFFFFF;
        btn.tint = 0xCCCCCC;
        selected.push(btn);
        selectedPath = path;
    }else {
        btn.tint = 0xCCCCCC;
        selected.push(btn);
        selectedPath = path;
    }
    system.displayStats(selectedPath);
    
}

// removes all children from canvas container
function clearScreen(){
    while(container.children.length > 0){
        let child = container.getChildAt(0);
        container.removeChild(child);
    }
}
//returns the path of highlighted object to fileSystem
function returnPath(){
    return selectedPath;
}

module.exports.returnPath = returnPath;
module.exports.clearScreen = clearScreen;
module.exports.Init = Init;
module.exports.createObjects = createObjects;
