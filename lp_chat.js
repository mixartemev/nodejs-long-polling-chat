var http = require('http');
var fs = require('fs');
var chat = require('./chat');
http.createServer(function (req, res) {
    switch (req.url){
        case '/':
            sendFile('lp_chat.html', res);
            break;
        case '/subscribe':
            chat.subscribe(req, res);
            break;
        case '/publish':
            var body = '';
            req
                .on('readable', function () {
                    body += req.read();
                    if(body.length > 1e4){
                        res.statusCode = 413;
                        res.end('too big')
                    }
                })
                .on('end', function () {
                    //console.log(body);
                    // try {
                    //     body = JSON.parse(body);
                    // } catch (e){
                    //     res.statusCode = 400;
                    //     res.end('Bad request');
                    //     return;
                    // }
                    chat.publish(JSON.parse(req.read()).message);
                    res.end('ok')
                });
            break;

        default:
            res.statusCode = 404;
            res.end('Hui vam');
    }
}).listen(3000);

function sendFile(fileName, res) {
    /* file */
    // fs.readFile(fileName, function (err, content) {
    //     if(err) throw err;
    //     else {
    //         res.setHeader("Content-Type", "text/html; charset=utf-8");
    //         res.end(content);
    //     }
    // })
    /* stream */
    // var stream = new fs.ReadStream(fileName/*, {encoding: 'utf-8'}*/);
    // stream.on('readable', write);
    // function write() {
    //     var fileContent = stream.read();
    //     if(fileContent && !res.write(fileContent)){
    //         stream.removeListener('readable', write);
    //         res.once('drain', function () {
    //             stream.on('readable', write);
    //             write();
    //         })
    //     }
    //     var data = stream.read();
    //     console.log(data);
    // }
    // stream.on('end', function () {
    //     console.log('THE END');
    //     res.end();
    // })
    /* pipe (= stream) */
    var stream = new fs.ReadStream(fileName/*, {encoding: 'utf-8'}*/);
    stream.pipe(res);
    stream
        .on('error', function (err) {
            res.statusCode = 505;
            res.end('Server error');
        })
        .on('open', function () {
            console.log('open');
        })
        .on('close', function () {
            console.log('close');
        });
    res.on('close', function () {
        stream.destroy();
    })
}