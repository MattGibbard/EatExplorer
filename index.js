//Add requires
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const app = express();

//Set global variables
let port = process.env.PORT || 8080;

//Allow app to use Public directory for CSS
app.use(express.static(__dirname + '/public'));
//Allow app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//Set view engine to EJS
app.set('view engine', 'ejs');

//Homepage render
app.get('/', function(req, res) {
    res.render('pages/home.ejs');
});


//Listen server
app.listen(port, function() {
    console.log(chalk.green('Server started and listening on port ' + port));
});