const fs = require('fs');
const path = require('path');
const hide = require('hidefile');
homedir = '/'



init();


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
                        elem.setAttribute("src", "Images/folder.png");
                        link.innerHTML = file.toString();
                        link.value = path.join(homedir,file.toString(),'/');
                        link.appendChild(elem);
                        
                    }else {
                        elem.setAttribute("src", "Images/binary.png");
                        link.innerHTML = file.toString();
                        link.value = path.join(homedir,file.toString(),'/');
                        link.appendChild(elem);
                        
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
                           
                            elem.setAttribute("src", "Images/folder.png");
                            
                            link.innerHTML = file.toString();
                            link.value = path.join(homedir,file.toString(),'/');
                            link.appendChild(elem);
                            
                        }else {
                            if(file.toString().match(/exe/)){
                                elem.setAttribute("src", "Images/binary.png");
                            }
                            else if(file.toString().match(/jpg|jpeg|png/)){
                                elem.setAttribute("src", "Images/image.png");
                            }
                            else if(file.toString().match(/mov|mp4|wmv|avi/)){
                                elem.setAttribute("src", "Images/movie.png");
                            }
                            else if(file.toString().match(/pdf/)){
                                elem.setAttribute("src", "Images/pdf.png");
                            }
                            else if(file.toString().match(/txt/)){
                                elem.setAttribute("src", "Images/text.png");
                            }
                            else{
                                elem.setAttribute("src", "Images/blank.png");
                            }
                            
                            link.innerHTML = file.toString();
                            link.value = path.join(homedir,file.toString(),'/');
                            link.appendChild(elem);
                            
                        }
                        link.addEventListener('click', () => {
                            clicked(link);
                        })
                        console.log(path.join(homedir,file));
                        li.appendChild(link);
                        display_grid.appendChild(li); 

                    }


                })

            })

        })
    }
}