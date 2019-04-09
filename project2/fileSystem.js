const fs = require('fs');
const path = require('path');
const getSize = require('get-folder-size');
const hide = require('hidefile');
homedir = '/'
init();


function init(){
    
    ul = document.getElementById("directory");
   
    fs.readdir(homedir,(err, file) => {
        
        file.forEach(file => {
           
            hide.shouldBeHidden(homedir + file, (err, result) => {
               
                if(err !== null) throw err;
                if(!result) {
                    li = document.createElement("li");
                    link = document.createElement("button");
                    link.innerHTML = file.toString();
                    //link.href = "http://www.google.com";
                    li.appendChild(link);
                    ul.appendChild(li); 
                }
            })
        })
    })

}