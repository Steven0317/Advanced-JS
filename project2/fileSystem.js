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
        let i = 0;
        let j = 0;
        if(err !== null) throw err;

        file.forEach(file => {

            hide.shouldBeHidden(homedir + file, (err, result) => {
               
                if(err !== null) throw err;
                
                if(!result) {
                    if(fs.statSync(path.join(homedir,file)).isDirectory()) {
                         renderer.createObject(
                                                file,
                                                path.join(homedir,file,),
                                                'dir',
                                                i
                                                )
                         }
                         if(i >=5){
                             i = 0;
                         }else {
                         i++;
                         }
                        j++;

                }

            })

        })

    })
}

function clickEvent(btn,text,path){
    console.log(text);
}

function init(){
   
    //leaving this global allows us to clear it in
    // utility functions
    display_grid = document.getElementById('grid');

    fs.readdir(homedir,(err, file) => {
        
        if(err !== null) throw err;

        file.forEach(file => {
           
            hide.shouldBeHidden(homedir + file, (err, result) => {
               
                if(err !== null) throw err;
                
                if(!result) {
               
                    let li = document.createElement("div");
                    li.className = ".grid-item";
                    let link = document.createElement("button");
                    let elem = document.createElement("img");

                   
                    if(fs.statSync(path.join(homedir,file)).isDirectory()) {
                        elem.setAttribute("src", "Images/Folder-128.png");
                        link.value = path.join(homedir,file.toString(),'/');
                        let sp = document.createElement('span');
                        sp.textContent = file.toString();
                        link.appendChild(elem);
                        link.appendChild(sp);
                        
                    }else {
                        elem.setAttribute("src", "Images/Automater-128.png");
                        link.value = path.join(homedir,file.toString(),'/');
                        let sp = document.createElement('span');
                        sp.textContent = file.toString();
                        link.appendChild(elem);
                        link.appendChild(sp);
                        
                    }
                    link.addEventListener('click', () => {
                        clicked(link);
                    })
                    li.appendChild(link);
                    display_grid.appendChild(li); 
                }
            })
        })
       
    })

}

/*
*   directory crawler function
*   checks if event is linked to a directory
*   will erase and create new display if so
*/
function clicked(clicked_object){
   
    if(fs.statSync(path.join(clicked_object.value)).isDirectory()){
        
         // clear old display grid //
        while(display_grid.firstChild) {
            display_grid.removeChild(display_grid.firstChild);
        }

        homedir = clicked_object.value + '/';
        
        fs.readdir(homedir,(err, file) => {
            
            if(err !== null) throw err;

            file.forEach(file => {
            
                hide.shouldBeHidden(homedir + file, (err, result) => {
                
                    if(err !== null) throw err;
                    
                    if(!result) {
                    
                        let li = document.createElement("div");
                        li.className = ".grid-item";
                        let link = document.createElement("button");
                        let elem = document.createElement("img");

                        if(fs.statSync(path.join(homedir,file)).isDirectory()) {
                           
                            elem.setAttribute("src", "Images/Folder-128.png");
                            
                            link.value = path.join(homedir,file.toString(),'/');
                            let sp = document.createElement('span');
                            sp.textContent = file.toString();
                            link.appendChild(elem);
                            link.appendChild(sp);
                            
                        }else {
                            if(file.toString().match(/exe/)){
                                elem.setAttribute("src", "Images/Automator-128.png");
                            }
                            else if(file.toString().match(/jpg|jpeg|png/)){
                                elem.setAttribute("src", "Images/iPhoto-128.png");
                            }
                            else if(file.toString().match(/mov|mp4|wmv|avi/)){
                                elem.setAttribute("src", "Images/iMovie-128.png");
                            }
                            else if(file.toString().match(/pdf/)){
                                elem.setAttribute("src", "Images/Text-edit-128.png");
                            }
                            else if(file.toString().match(/txt/)){
                                elem.setAttribute("src", "Images/Text-edit-128.png");
                            }
                            else{
                                elem.setAttribute("src", "Images/File Blank-128.png");
                            }
                            
                            link.value = path.join(homedir,file.toString(),'/');
                            let sp = document.createElement('span');
                            sp.textContent = file.toString();
                            link.appendChild(elem);
                            link.appendChild(sp);
                            
                        }
                        link.addEventListener('click', () => {
                            clicked(link);
                        })
                        li.appendChild(link);
                        display_grid.appendChild(li); 

                    }


                })

            })

        })
    }
}


module.exports. clickEvent = clickEvent;