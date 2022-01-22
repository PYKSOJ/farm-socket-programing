var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;


var db = {}
net.createServer(function (sock) {
    var state = 0 //idle
    var current_key = null    
    sock.on('data', function (data) {
        switch(state){
            case 0:// call pet list
            
                if(data == 'HELLO'){
                    sock.write("hello from pet shop")
                    state = 1 //wait for key
                }
                else if(data == "OUT"){
                    console.log("checkout from pet shop")
                    sock.destroy()
                }
                break
            case 1:// show list , wait feeding and registry
                if(data == "FEED"){
                    state = 3               
                }
                else if(data == "REGISTRY"){
                    sock.write("register your pet")
                    state = 2 //wait for number
                }
                
                break
            case 2:// register state
                
                if(data == 'BYE'){
                    state = 0 //end                    
                }else{
                    // register pet and set hungry = 0
                    sock.write("" + (db[current_key] || 0))
                    state = 3
                }
                break    
            case 3://feed state
                
                current_key = data
                sock.write("pet ready to feed")
                state = 4
                break
            case 4://feeding
                if(data == 'BYE'){
                    state = 0 //end                    
                }
                else if(db[current_key] >= 10){
                    while(db[current_key]>=0){
                        
                        if(db[current_key]>=10){
                            sock.write("full")
                        }
                        else if(db[current_key]>=5){
                            sock.write("ready to eat\n")
                        }
                        else if(db[current_key]==0){
                            
                            sock.write("hungry")
                            console.log("l3")
                            state = 0
                        }
                        db[current_key] -= 1
                    }
                    
                }
                else{
                    try{
                        let v = parseInt(data)
                        if(!db[current_key])
                            db[current_key] = 0
                        db[current_key] += v
                        sock.write("" + db[current_key])
                    }catch(e){
                        sock.write('INVALID')
                    }     
                }
                break  
            
                
                
        }
    });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);