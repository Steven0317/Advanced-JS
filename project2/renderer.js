const PIXI = require('pixi.js');
const system = require('./fileSystem.js');


/*  
*   each object will be given a color from this
*   dictionary
*/
colorDict = {
    'blue':   0x89CEF0,
    'orange': 0xFFA48C,
    'yellow': 0xFFDF8C,
    'purple': 0x939FF2
};
/*
* text style for all rendered text
*/
const style = new PIXI.TextStyle({
    fontFamily: 'Monospace',
    fontSize: 18,
    wordWrap: true,
    wordWrapWidth: 100
})
/*
*   Initialize the renderer engine and append to doc
*/
function Init(){

    let elem = document.getElementById('treeview');

    const app = new PIXI.Application({
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

    container.pivot.x = 0;
    container.pivot.y = 0;
}

function createObject(name, path, type, i){
    /*
    *   create a rectangle object for each file
    *   params that are passed 
    */

    let rect = new PIXI.Graphics();
    if(type == "dir"){

        /*
        * create rectangle object
        */
        rect.beginFill(colorDict['blue'],1);
        rect.drawRect((i % 4) * 205, Math.floor((i / 4)) * 205, 200,200);
        rect.endFill();
        rect.interactive = true;
        rect.buttonMode = true;
        
       

        /*
        *   create text object
        */
       let text = new PIXI.Text(name, style);
       console.log(rect.x)
       text.x = ((i%4) * 205) + (125/2);
       text.y = (Math.floor((i / 4)) * 205) + (150/2);
      
       /*
       *    button bindings
       */
       rect.on('pointerover', onButtonOver(rect));
       rect.click = system.clickEvent.bind(rect, text, path);
       
       /*
       *append created object to container
       */
       container.addChild(rect);
       container.addChild(text);
    }
}

function onButtonOver(btn){
    console.log(btn);
}

module.exports.Init = Init;
module.exports.createObject = createObject;
