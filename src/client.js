var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;
var client = new net.Socket();

var values = 0;
var state = 0

client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    client.write('HELLO');
    state = 1
    console.log('wait for HELLO');
});


client.on('data', function (data) {
    switch (state) {
        case 1:
          if (data == 'hello from pet shop') {
            console.log(""+data)
            client.write('REGISTRY')
            state = 2
                
          }
        break
        case 2:
          console.log(""+data)
          client.write('DOG')
          state = 3
        break
        case 3:
          console.log(""+data)
          client.write('DOG')
          state = 4
        break
        case 4:
          console.log(""+data)
          client.write(""+values)
          state = 5
        break
        case 5:
          console.log(""+data)
          if(data <= 10){
            values++
            client.write(""+values)
          }
          else{
            state = 6
          }
        break
        case 6:
          console.log(""+data)
        break
    }
});


client.on('close', function () {
    console.log('Connection closed');
});