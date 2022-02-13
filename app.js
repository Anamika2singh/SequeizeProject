require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json")
const httpLogger = require('./middlewere/httpsLogger');
const logger = require('./utills/logger');
const route = require('./routes')
var fs = require("fs");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var path = require('path');
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
    cors: {
        origin: ["http://localhost:3000", ""],// URL: ws://localhost:1337/socket.io/?EIO=3&transport=websocket
    }
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async(req,res)=>{
    res.send("welcome");
})
app.use(httpLogger);
app.use(route)


app.use('/api-docs', swaggerUI.serve);
app.get('/api-docs', swaggerUI.setup(swaggerDocument));

app.get('/error-log',(req,res)=>{
    var data = fs.readFileSync('logs/all-logs.log','utf8');
    return res.send(data.toString());
})
httpServer.listen(process.env.PORT, () => {
    logger.info(`Server listening on port ${process.env.PORT}`);
});