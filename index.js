var express = require('express');
var app = express();
var http = require('http').createServer(app);

var bodyParser = require('body-parser');
var path = require('path');
var crudRoute = require('./crud');

var io = require('socket.io')(http);
var routes = require('./routes')(io);


io.on('connection', (socket) => {

    console.log(new Date().toLocaleString()+"----Client Connected to server.");
    socket.join('dataRoom');

    socket.on('disconnect', function () {

        console.log(new Date().toLocaleString()+"----Client Connected to server.");

    })
})


global.__baseDir = __dirname;


app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'Scripts')));
app.use(express.static(path.join(__dirname, 'Styles')));

app.use(express.static(path.join(__dirname, 'Assets')));

app.use(express.static(path.join(__dirname, 'node_modules/jquery')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery-ui')));


// app.use(express.static(path.join(__dirname,'/node_modules/font-awesome')));




app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', crudRoute);

app.use('/api', routes);



http.listen(5000, function () {
    console.log(new Date().toLocaleString()+"----Server started at port 5000");
})