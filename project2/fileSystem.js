const fs = require('fs');
const path = require('path');
const renderer = require('./renderer.js');
const stack = require('./Stack.js');

homedir = '/'

Init();


/*
*   Initialization Loop:
*       sets up renderer, passes root files
*       to renderer and adds event listeners to buttons
*/
function Init(){
    
 
    pathStack = new stack();
    pathStack.push(homedir);
   
    renderer.Init();

    fs.readdir(homedir,(err,file) =>{
        if(err !== null) throw err;

        renderer.createObjects(file, homedir);
    })


    let dir = document.getElementById("root")
    dir.addEventListener("click", function(){changeDir("root")});

    dir = document.getElementById("del")
    dir.addEventListener("click", function(){changeDir("del")});

    dir = document.getElementById("add")
    dir.addEventListener("click", function(){changeDir("add")});

    dir = document.getElementById("mov")
    dir.addEventListener("click", function(){changeDir("mov")});

    dir = document.getElementById("cop")
    dir.addEventListener("click", function(){changeDir("cop")});

    dir = document.getElementById("Back");
    dir.addEventListener("click", function(){changeDir("back")});
}

// function coming exposed to renderer
// just passes the string along to directory
// crawler
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

        pathStack.push(homedir);

        fs.readdir(homedir,(err,file) =>{
            if(err !== null) throw err;
           
            renderer.createObjects(file, homedir);
        })

    }else {
        readFile(clicked_path);
    }
}


/*
*  button click handling function
*   will perform various actions from moving up
*   directory tree/ back to root and moving/copying/
*   add/deleting files
*/
function changeDir(clicked_id){
   
    if(clicked_id == 'root'){
       
        //clear stack and return to root 
        while(!pathStack.isEmpty()){
            pathStack.pop();
        }
        
        homedir = '/';
        objectClick(homedir);

    }
    else if(clicked_id == 'del'){
        let tbd = renderer.returnPath();
        
        //unlink as file, if error try as dir
        try{
            fs.unlinkSync(tbd);
            objectClick(homedir);
        } catch(err) {
            
        
            fs.rmdir(tbd, (err) => {
                if(err) throw err;
            });
            objectClick(homedir);
          
        }
    }
    else if(clicked_id == 'add'){
        //adds input box on click
        addSearchObject();
    }
    else if(clicked_id == 'mov'){
        //moves selcted file on click
        let tbm = renderer.returnPath();
        pop = tbm.toString().split('\\').pop();
       
        fs.rename(tbm, path.join(homedir,pop), err =>{
            if(err) throw err;
            
        })
        objectClick(homedir);
    }
    else if(clicked_id == 'cop'){
        //copies selected file on click
        let tbc = renderer.returnPath();

        pop = tbc.toString().split('\\').pop();

        fs.copyFile(tbc, path.join(homedir,pop), (err) => {
            if (err) throw err;
        });
        objectClick(homedir);
    }
    else if(clicked_id == 'back'){
            //pops the current directory and resets the current dir to top of stack
            pathStack.pop();
            homedir =  pathStack.pop();
            objectClick(homedir);
    }
}



/*
*   adds an input box to the nav bar 
*/

function addSearchObject(){

    let elem = document.getElementById("navbar");
    
    box = document.getElementById("addBox");
    /*
    *   check if search box already exists or not
    */
    if(box == null){
        let input = document.createElement("input");
        input.type = "text";

        input.placeholder = "file/folder name"
        input.id = "addBox";
        input.addEventListener('keydown',  function(e) {
            if(e.keyCode == 13){
                addFile();
            }
        });
        elem.insertBefore(input, elem.childNodes[5]);
    }
}

/*
*   creates a file of folder depending on context of 
*   input box
*/
function addFile(){

    let elem = document.getElementById("addBox");
    
    /*
    *   adds either a file or directory depending 
    */
    if(elem.value.toString().indexOf('.') !== -1){
        console.log(elem.value.toString().indexOf('.') !== -1)
        fs.open(path.join(homedir,elem.value,'/'),'w',function(err) {
            if(err) throw err;
            document.getElementById("addBox").remove();
            objectClick(homedir);
        });
    }else{
        try{
        
            fs.mkdirSync(path.join(homedir,elem.value))
            document.getElementById("addBox").remove();
            objectClick(homedir);
            
        }catch(err) {
                if(err) throw alert(err);
            }
        
    }
}

/*
*   displays basic info about highlighted
*   folder/file
*/
function displayStats(highlighted_path){
    /*
    *   grab file info for selected file.
    */
    let stats = fs.statSync(highlighted_path);
    let size = stats.size;
    let mtime = stats.mtime;
    let birthtime = stats.birthtime;

    let parent = document.getElementById("stats");

    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    
    let nPath = document.createElement("p");
    let nSize = document.createElement("p");
    let nM = document.createElement("p");
    let nB = document.createElement("p");  
    
    nPath.innerText = "Path: " +highlighted_path;
    parent.appendChild(nPath);

    nSize.innerText = "Size: " + size + " bytes";
    parent.appendChild(nSize);

    nM.innerText =  "Last Modified: " +mtime;
    parent.appendChild(nM);

    nB.innerText = "Date Created: " + birthtime;
    parent.appendChild(nB);
}

/*
*   reads selected file  and appends it to div
*/
function readFile(clicked_path){

    fs.readFile(clicked_path, (err, data) => {
        if(err) throw err;
        let elem = document.getElementById("grid")
        let child = document.createElement("item");
        child.innerText = data;

        let btn = document.createElement("button");
        btn.innerText = "close";
        btn.addEventListener("click", function() {
            closeFile();
        })
        elem.appendChild(btn);
        elem.appendChild(child);
        
    })
}

//closes out displayed file
function closeFile() {
    let parent = document.getElementById("grid");

    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

module.exports.displayStats = displayStats;
module.exports.clickEvent = clickEvent;