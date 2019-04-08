const fs = require('fs');
const path = require('path');
const dirTree = require("directory-tree");
const getSize = require('get-folder-size');
const homedir = require('os').homedir();

init();


function init(){
    
    ul = document.getElementById("directory");
    fs.readdir(homedir,(err, file) => {
        file.forEach(file => {
            if(file[0] !== "." && file[6] !== "."){
                li = document.createElement("li");
                link = document.createElement("button");
                link.innerHTML = file.toString();
                //link.href = "http://www.google.com";
                li.appendChild(link);
                ul.appendChild(li); 
            }
        })
    })

}