const bodyParser = require('body-parser')
const cors = require('cors')
const { socketFunction } = require('./socketFunction');
const port = process.env.PORT || 8000
var express  = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use(bodyParser.json())
    
    server.listen(port, () =>
    console.log("Server App is Running on port:"+port)
)
io.on('connection', client => socketFunction(client,io));
