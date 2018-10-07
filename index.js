//Add requires
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const chalk = require('chalk');
const yelp = require('yelp-fusion');

const app = express();

//Set global variables
let port = process.env.PORT || 8080;
const yelpClient = yelp.client('h04jR83l6ypfTbuAA7IqQmVgMTnhbgMkALkyGapX6W57ez-ODD2okL7PgOqc9Gk30IEDGbkjUSu8X7lRbB6T7MCMZCr_mOwkbl11w2xM8nr6z_QAL-dErj3-KJu4W3Yx');

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

    request('https://api.postcodes.io/postcodes/' + urlParamPostcode, function (error, response, body) {
        postcodeAPIResponse = JSON.parse(body);
        //console.log('error:', error);
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body);

        console.log(chalk.red('Status code: ' + postcodeAPIResponse.status));

        if (postcodeAPIResponse.status != '200') {
            res.render('pages/home.ejs', {error: postcodeAPIResponse.status});
            //Quit rest of process
            return

        }

            console.log(chalk.yellow('Postcode quality: ' + postcodeAPIResponse.result.quality));
            console.log(chalk.yellow('Lat: ' + postcodeAPIResponse.result.latitude));
            console.log(chalk.yellow('Long: ' + postcodeAPIResponse.result.longitude));

            yelpClient.search({
                latitude: postcodeAPIResponse.result.latitude,
                longitude: postcodeAPIResponse.result.longitude,
                categories: 'restaurants',
                //locale: 'en_GB',
                radius: '5000',
                price: '1, 2, 3, 4',
                limit: '50', //Limit is severly affected by radius
                open_now: 'true',
                sort_by: 'rating'
            })
            .then(yelpResponse => {
                console.log(chalk.bgMagenta(yelpResponse.jsonBody.total + ' businesses found on Yelp in total.'));
                console.log(chalk.bgMagenta(yelpResponse.jsonBody.businesses.length + ' businesses returned by API. 50 limit.'));
                console.log(chalk.magenta(yelpResponse.jsonBody.businesses[0].name));
                console.log(yelpResponse.jsonBody.businesses[0]);
                //console.log(yelpResponse.jsonBody);
                let randomBusinessCalc = Math.floor(Math.random() * (yelpResponse.jsonBody.businesses.length));
                res.render('pages/result.ejs', {businessData: yelpResponse.jsonBody, randomBusiness: randomBusinessCalc});
            })
            .catch(error => {
                console.log('Error: ' + error);
                res.render('pages/home.ejs', {error: error});
            });

    
    });
});


//Listen server
app.listen(port, function() {
    console.log(chalk.green('Server started and listening on port ' + port));
});