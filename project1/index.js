const WebSocket = require('ws');
const blessed = require('blessed');
const contrib = require('blessed-contrib')
const cliCurosr = require('cli-cursor');
const chalk = require('chalk');
var fs = require('fs'), styles;

/***** get user input for connection as cli arguments or set to defaults *****/
host = process.argv[2] || 'localhost';
port = process.argv[3] || '4930';
userName = process.argv[4] || 'username';

cliCurosr.hide();

fs.readFile('./styles.json', (err,data)=> {
  if(err) throw err;
  styles = JSON.parse(data);
  console.log(styles);
})
userMap = new Map();

/**** user color array, would be bigger but microsoft doesnt like using colors in their terminals *****/
colorList = ['#FF0000', '#FFFFFF', '#008000', '#0000FF', '#FF00FF', '#880080', '#800000', '#00FF00', '#00FFFF' ];


/***** tui begins, screen is parent and all children are placed into grid *****/
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
      fg: 'white'
    }
  })

  sidebar = grid.set(0,4,6,2, blessed.list, {
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

  inputText = grid.set(4,0,2,5, blessed.textbox, {
    label: 'Message',
    inputOnFocus: true,
    keys: true,
    mouse: true,
    
  })

  directMessageBox = grid.set(0,3,5,2, blessed.log, {
    label: 'Direct Message',
    style:
    {
      bg: 'black'
    }
  })
  // Append elements to the screen.
  screen.append(box);
  screen.append(directMessageBox);
  screen.append(inputText);
  screen.append(sidebar);
  directMessageBox.hide();
  inputText.focus();

createConnection(userName);


inputText.on('submit', (line) => {
    
    if(line.trim() != '')
    {
      //check for open connection on client side
      if(ws.readyState == ws.OPEN){
          
        //check for direct message 
          if(/^[@]/.test(line)){
            let message = line.split(' ');
            let user = message[0].substring(1,message[0].length);
           
              ws.send(JSON.stringify({
                from: userName,
                to: user,
                kind: 'direct',
                data : line.substring(message[0].length,line.length)
              }))    
           
          }else{
            ws.send(JSON.stringify({
                from: userName,
                to: 'all',
                kind: 'chat',
                data: line
            }))
        }
      }else{
        if(/[\w]{3,10}/.test(line)){
          createConnection(line);

        }
      }
    }
    inputText.clearValue();
    inputText.focus();
});


/**** handles all incoming messages,shoud not have to check for proper json since server does that before sending *****/
ws.on('message', function incoming(message) {
    
    let temp = JSON.parse(message);
    let color = userMap.get(temp.from);
    
    switch(temp.kind){
    
    case 'chat':       box.log(chalk.hex(color)(temp.from) + " : " + temp.data, );
                        break;
    case 'connection': box.log(chalk.yellowBright(temp.from) + " : " + temp.data);
                        addRemoveUser(temp.data);
                        break;
    case 'direct':     directMessageBox.show(); 
                        directMessageBox.log(chalk.hex(color)(temp.from + ' (direct message)') + ' : ' + chalk.greenBright(temp.data));
                        break;
    case 'userlist':   sidebarHandler(temp.data);
                        break;
    case 'error':      box.log(chalk.red(temp.from + " : " + temp.data));
                         if(/(invalid|taken)/.test(temp.data)){
                             box.log(chalk.red('Enter a username between 3 and 10 characters long to reconnect to the server'))
                          }
                        break;
    }
    screen.render();

});

/**** populates the sidebar with userlist, since each username is unique can check the names against our global and mark user appropriately *****/
function sidebarHandler(data){
 
  let users = data.split(',');
  sidebar.setText();
    
    users.forEach(element => {
      
      //add any users that were in chat before client to userMap
      if(!userMap.has(element)){
        userMap.set(element,colorList[Math.floor(Math.random() * colorList.length)]);
      }
      let color = userMap.get(element);
      if(element == userName){
        
        sidebar.pushLine(chalk.hex(color)(element + ' (you)'));
      }else{
      
        sidebar.pushLine(chalk.hex(color)(element));
      }
    });
}

/**** adds or removes users on connection event from server *****/
function addRemoveUser(data){ 
  
  let user = data.split(' ');
 
  if(user[2] == 'joined'){   
     
    userMap.set(user[0],colorList[Math.floor(Math.random() * colorList.length)]);
     let color = userMap.get(user[0]);

    if(user[0] == userName){
      sidebar.pushLine(chalk.hex(color)(user[0]+' (you)'));
    }else{
      sidebar.pushLine(chalk.hex(color)(user[0]));
    }
  }else{
    userMap.delete(user[0]);
    sidebar.removeItem(user[0]);
  }
  
}

/**** Create websocket connection ****/
function createConnection(uname){
  try{
    ws =  new WebSocket(`ws://${host}:${port}/?username=${uname}`);
  }catch(e){
    box.log(e);
  }
}

/**** interval function to ping server for userlist command *****/
setInterval(() =>{
  if(ws.readyState == ws.OPEN){
      ws.send(JSON.stringify({
        from: userName,
        to: '',
        kind: 'userlist',
        data: ''
      }))
      inputText.focus();
  }
 
}, 1000)