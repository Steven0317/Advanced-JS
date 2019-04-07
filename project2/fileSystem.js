const fs = require('fs');
const path = require('path');
const dirTree = require("directory-tree");
const getSize = require('get-folder-size');
const homedir = require('os').homedir();
const tree = dirtree(homedir);

container = document.getElementById("directory");

newItem = docuemnt.createELement('li');
newItem.innerText = "hello";

container.appendChild(newItem);