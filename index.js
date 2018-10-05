//Add requires
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
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

//Find route
app.post('/find', function(req, res) {
    //Should format the postcode to remove spaces etc
    res.redirect('/find/' + req.body.postcode);
});

//Postcode render
app.get('/find/:postcode', function(req, res) {
    //Save postcode parameter in URL
    var urlParamPostcode = (req.params.postcode);
    console.log(chalk.blue(urlParamPostcode));

    //Need to show onscreen loader at this point

    //Need to add postcode validity checker here.
    //api.postcodes.io/postcodes/[postcode]/validate

    request('https://api.postcodes.io/postcodes/' + urlParamPostcode, function (error, response, body) {
        postcodeAPIResponse = JSON.parse(body);
        //console.log('error:', error);
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body);

        console.log(postcodeAPIResponse.result.quality);
        console.log(postcodeAPIResponse.result.longitude);
        console.log(postcodeAPIResponse.result.latitude);

    });

    //Need to figure our which local business service to use.
    // https://developers.zomato.com/api
    // https://developers.google.com/places/web-service/search#PlaceSearchRequests

    res.render('pages/home.ejs');
});


//Listen server
app.listen(port, function() {
    console.log(chalk.green('Server started and listening on port ' + port));
});