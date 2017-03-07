var alexa = require('alexa-app');
var app = new alexa.app();
var request = require('request');

/**
 * LaunchRequest.
 */
app.launch(function(request,response) {
	response.say('What would you like me to find');
});


app.intent('movie',
	{
		'slots' : {'movie': 'MOVIE'},
		'utterances' : ['find the movie {movie}', 'show me the movie {movie}']
	},
	function (req, res) {
		var movie = req.slot('movie');
		request('https://itunes.apple.com/search?term=' + movie + '&media=movie', function (error, response, body) {
			if (error) {
				res.say('Could not find search results for ' + movie);
				res.shouldEndSession(true);
				res.send();
			} else if (body.results.length > 1) {
					res.say('I found multiple results for ' + movie);
				} else {
					res.say('Here is what I found for ' + movie + '. Please look at the Alexa app for more info');
					res.card(
						body.reults[0].trackName,
						body.results[0].trackViewUrl,
						'Rent in HD: ' + body.results[0].trackHdRentalPrice,
						'Rent in SD: ' + body.results[0].trackRentalPrice,
						'Buy HD: ' + body.results[0].trackHdPrice,
						'Buy SD: ' + body.results[0].trackPrice
					);
			}
		});
	}
);

app.intent('music',
	{
		'slots' : {'song' : 'SONG'},
		'utterances' : ['find me the song {song}']
	},
	function (req, res) {
		var song = req.slots('song');
		request('https://itunes.apple.com/search?term=' + song + '&media=music', function (error, response, body) {
			if (error) {
				res.say('Could not find search results for ' + song);
				res.shouldEndSession(true);
				res.send();
			} else if(body.request.length > 1) {
				res.say('I found multiple results for ' + song);
			} else {
				res.say('Here is what I found for ' + song + '. Please look at the Alexa app for more info');
				res.card(
					body.results[0].collectionName,
					body.results[0].artworkUrl100,
					body.results[0].artistName,
					body.results[0].trackViewUrl
				);
			}
		});
	}
);



/**
 * Error handler for any thrown errors.
 */
app.error = function(exception, request, response) {
    response.say('Sorry, something bad happened');
};

// Connect to lambda
exports.handler = app.lambda();
