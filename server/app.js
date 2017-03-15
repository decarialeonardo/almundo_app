const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

//app.use(express.bodyParser());
app.set('views', path.join(__dirname + '/../views'));
app.set('view engine', 'pug');
app.use('/almundo_app/static',express.static(path.join(__dirname,'/../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(3000);
console.log('Almundo app and listening on port 3000');
