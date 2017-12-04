var http = require('http');
var server = new http.Server();
const port = 3000;
server.listen(port, '127.0.0.1');
// var emit = server.emit;
// server.emit = function (event, arg1, arg2) {
//     console.log([event, arg1?typeof arg1:'']);
//     emit.apply(server, arguments)
// };
server.on('listening', function () {
    console.log('console: I listen port: ' + port);
});
var soc;
server.on('connection', function (sock) {
    console.log('connection', this._handle.toString() + ', bytesRead: '+this._handle.bytesRead + ', fd: '+this._handle.fd + ', cKey: '+ this._connectionKey);
    soc = sock;
});

var url = require('url');
var counter =0;
server.on('request', function (req, res) {
    console.log('request: ', counter, req.method, req.url);

    var urlParsed = url.parse(req.url, true);
    console.log(urlParsed);
    if(urlParsed.pathname === '/echo'){
        if(mess = urlParsed.query.mess){
            res.end(mess)
        }else {
            res.statusCode = 404;
            res.end('Not found');
        }
    }else {
        res.end('requested ' + ++counter);
    }
});
