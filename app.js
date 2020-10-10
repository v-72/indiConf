const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    cors = require('cors');
let master = null;
let slave = null;
    app.use(cors());
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(bodyParser.json());
    app.use('/', express.static(path.join(__dirname, 'public')))
    app.get('/api', (req, res) => {
        let token = "";
        if(req.query.type === 'master'){
            token = master;
        }else{
            token = slave;
        }
        res.send({success: true, token});
    });
    app.post('/api', (req, res) => {
        console.log(req.body)
        if(req.body.type == "master"){
            master = req.body.token;
        }else{
             slave = req.body.token;
        }
        res.send({success: true});
    });

    const server = app.listen(5000, () => {
        console.log("App started in port ", 5000)
    });