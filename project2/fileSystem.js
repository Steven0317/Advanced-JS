const fs = require('fs');
const path = require('path');
const hide = require('hidefile');
const renderer = require('./renderer.js');
homedir = '/'


//init();
Init();


function Init(){
    
    renderer.Init();
    fs.readdir(homedir,(err,file) =>{
        if(err !== null) throw err;

        renderer.createObjects(file, homedir);
    })
}

function clickEvent(param, e){
    objectClick(param);
}

/*
*   directory crawler function
*   checks if event is linked to a directory
*   will erase and create new display if so
*/
function objectClick(clicked_path){

    //check if clicked objec is a directory
    if(fs.statSync(path.join(clicked_path)).isDirectory()){

        renderer.clearScreen();

        homedir = path.join(clicked_path,'/');
       
        fs.readdir(homedir,(err,file) =>{
            if(err !== null) throw err;
           
            renderer.createObjects(file, homedir);
        })

    }
}

module.exports. clickEvent = clickEvent;