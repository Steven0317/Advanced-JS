const WebSocket = require('ws');
const Readline = require('readline');

rl = Readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>  '
});

host = process.argv[2] || 'localhost';
port = process.argv[3] || '4930';
userName = process.argv[4] || 'username';

//rl.setPrompt(`Welcome ${userName}`);

const ws = new WebSocket(`ws://${host}:${port}/?username=${userName}`);

const craftMessage = (from, to, kind, data) => JSON.stringify({
    from, to, kind, data,
});



ws.on('message', function incoming(message) {
    temp = JSON.parse(message);
    console.log(temp.from + " : " + temp.data);
    rl.prompt();

});

rl.on('line', function(line) {
    if(line.trim() != 'null')
    {
        ws.send(JSON.stringify({
            from: userName,
            to: 'all',
            kind: 'chat',
            data: line
        }))
    }
    rl.prompt();
})






