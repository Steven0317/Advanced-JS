const WebSocket = require('ws');
const blessed = require('blessed');
const contrib = require('blessed-contrib')
const cliCurosr = require('cli-cursor');

cliCurosr.hide();

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

grid = new contrib.grid({rows: 5, cols: 5, screen: screen})

host = process.argv[2] || 'localhost';
port = process.argv[3] || '4930';
userName = process.argv[4] || 'username';

const ws = new WebSocket(`ws://${host}:${port}/?username=${userName}`);



screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));

screen.key('enter', (ch, key) => {
  inputText.focus();
});


box = grid.set(0, 0, 5, 5, contrib.log, {
  label: 'Server Chat',
  style:
{ 
  border: {
  type: 'line'
  },
  bg: 'black',
  fg: 'green'
}})

sidebar = grid.set(0,4,5,2, blessed.list, {
  label: 'User List',
  style:
  {
    alwaysScroll: true,
    scrollable: true, 
    mouse: true, 
    list: [''],
    border: {
      type: 'line'
    },
    bg: 'black',
    fg: 'white'
  }
})

inputText = grid.set(4,0,1,5, blessed.textbox, {
  label: 'Message',
  inputOnFocus: true,
  keys: true,
  mouse: true,
  stle:
  {
    border: {
      type: 'line'
    }
  }
})



  // Append elements box to the screen.
  screen.append(box);
  screen.append(inputText);
  screen.append(sidebar);

  inputText.focus();
  screen.render();





inputText.on('submit', (line) => {
    
    if(line.trim() != '')
    {
        ws.send(JSON.stringify({
            from: userName,
            to: 'all',
            kind: 'chat',
            data: line
        }))
    }
    inputText.clearValue();
    inputText.focus();
});

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


function addRemoveUser(data){
  
  let user = data.split(' ');

  if(user[2] == 'joined'){
    if(user[0] == userName){
      sidebar.pushItem(user[0]+'(you)');
    }else{
      sidebar.pushItem(user[0]);
    }
  }else{
    sidebar.removeItem(user[0]);
  }
  
  
}

setInterval(() =>{
  ws.send(JSON.stringify({
    from: userName,
    to: '',
    kind: 'userlist',
    data: ''
  }))
  inputText.focus();
 
}, 1000)