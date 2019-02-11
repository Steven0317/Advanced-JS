const WebSocket = require('ws');
const blessed = require('blessed');
const contrib = require('blessed-contrib')
const cliCurosr = require('cli-cursor');
const chalk = require('chalk');

/***** get user input for connection as cli arguments or set to defaults *****/
host = process.argv[2] || 'localhost';
port = process.argv[3] || '4930';
userName = process.argv[4] || 'username';

cliCurosr.hide();
var ws;

userMap = new Map();

colorList = ['red','green','yellow','magenta','cyan','white','redBright','greenBright','yellowBright','blueBright','magentaBright','cyanBright','whiteBright'];

/***** cl-ui begins, screen is parent and all children are placed into grid *****/
/***** that way the boxes will uniformly resize as the screen resizes  *****/
screen = blessed.screen({
    smartCSR: true,
    dockBorders: true,
    autoPadding: true,
    artificialCursor: true,
    cursorShape: 'line',
    cursorBlink: true,
    cursorColor: null,
    ignoreDockContrast: true
})

/***** escape sequence and focus to input box *****/
screen.key(['escape'], (ch, key) => (process.exit(0)));

screen.key('enter', (ch, key) => {
  inputText.focus();
});


grid = new contrib.grid({rows: 5, cols: 5, screen: screen})

box = grid.set(0, 0, 5, 5, contrib.log, {
  label: 'Server Chat',
  scrollable: true,
  style:
  { 
    bg: 'black',
    fg: 'green'
  }
})

sidebar = grid.set(0,4,5,2, blessed.list, {
  label: 'User List',
    alwaysScroll: true,
    scrollable: true, 
    mouse: true, 
    list: [''],
    style:
    {
      bg: 'black'
    }

})

inputText = grid.set(4,0,1,5, blessed.textbox, {
  label: 'Message',
  inputOnFocus: true,
  keys: true,
  mouse: true,
  
})



// Append elements to the screen.
screen.append(box);
screen.append(inputText);
screen.append(sidebar);
inputText.focus();
screen.render();


  ws = new WebSocket(`ws://${host}:${port}/?username=${userName}`);

 
  /* check for open connection 
  *  this interval must be at least as long
  *  as server interval, most likely longer
  *  to deal with any latency along the way
  */ 
  ws.on('open', heartbeat);
  ws.on('ping', heartbeat);
  ws.on('close', function clear() {
    clearTimeout(this.pingTimeout);
  });


inputText.on('submit', (line) => {
    
    if(line.trim() != '')
    {
        ws.send(JSON.stringify({
            from: userName,
            to: 'all',
            kind: 'chat',
            data: line
        })
        )
    }
    inputText.clearValue();
    inputText.focus();
});

/**** handles all incoming messages,shoud not have to check for proper json since server does that before sending *****/
ws.on('message', function incoming(message) {
    
    let temp = JSON.parse(message);
    switch(temp.kind){
    
    case 'chat':       box.log(temp.from + " : " + temp.data);
                        break;
    case 'connection': box.log(temp.from + " : " + temp.data);
                        addRemoveUser(temp.data);
                        break;
    case 'userlist':   sidebarHandler(temp.data);
                        break;
    case 'error':      box.log(temp.from + " : " + temp.data);
                        break;
    }
    screen.render();

});

/**** populates the sidebar with userlist, since each usernake is unique can check the names against our global and mark user appropriately *****/
function sidebarHandler(data){
    
  let users = data.split(',');

    sidebar.clearItems();

    users.forEach(element => {
      
      if(element == userName){
      sidebar.pushItem(element + ' (you)');
      }else{
        sidebar.pushItem(element);
      }
    });
}

/**** adds or removes users on connection event from server *****/
function addRemoveUser(data){
  
  let user = data.split(' ');

  if(user[2] == 'joined'){
    userMap.set(user[0],colorList[4]);
    
    if(user[0] == userName){
      colors = userMap.get(user[0]);
      //sidebar.pushLine(colorList[6]);
      sidebar.pushItem((user[0]+' (you)'));
    }else{
      sidebar.pushItem(user[0]);
    }
  }else{
    
    userMap.delete(user[0]);
    sidebar.removeItem(user[0]);
  }
  
}
/**** color generator function *****/
function randomColor() {
  return [parseInt(Math.random() * 255),parseInt(Math.random() * 255),parseInt(Math.random() * 255)];
}

/***** heartbeat function, times out if no pong is heard back from server  *****/
function heartbeat() {
  clearTimeout(this.pingTimeout);

  this.pingTimeout = setTimeout(() => {
    box.log("Connection to sever lost");
    this.terminate();
  }, 30000 + 1000);
}

/**** interval function to ping server for userlist command *****/
setInterval(() =>{
  
    ws.send(JSON.stringify({
      from: userName,
      to: '',
      kind: 'userlist',
      data: ''
    }))
    inputText.focus();

 
}, 1000)