const WebSocket = require('ws');
const blessed = require('blessed');

screen = blessed.screen({
    smartCSR: true,
    dockBorders: true,
    artificalCursor: true
})


host = process.argv[2] || 'localhost';
port = process.argv[3] || '4930';
userName = process.argv[4] || 'username';

const ws = new WebSocket(`ws://${host}:${port}/?username=${userName}`);

const craftMessage = (from, to, kind, data) => JSON.stringify({
    from, to, kind, data,
});


box = blessed.box({
    top: 'top',
    width: '100%',
    height: '95%', 
    keys: true,
    mouse: true,
    alwaysScroll: true,
    scrollable: true,  
    border: {
      type: 'line'
    },
    style: {
        bg: 'black',
        fg: 'green'
    }
  });

inputText = blessed.textbox({
      bottom: '0',
      width: '100%',
      height: '10%',
      inputOnFocus: true,
      border: {
        type: 'line'
      }
  })
  
  // Append our box to the screen.
  screen.append(box);
  screen.append(inputText);

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });
  
  // Focus our element.
  inputText.focus();
  
  // Render the screen.
  screen.render();

ws.on('message', function incoming(message) {
    
    temp = JSON.parse(message);
   
    box.pushLine(temp.from + " : " + temp.data)
    
    screen.render();

});


inputText.on('submit', (line) => {
    
    if(line.trim() != 'null')
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


  screen.key('enter', (ch, key) => {
    inputText.focus();
  });

  screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));







