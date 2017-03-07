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
			} else {
				res.say('Here is what I found for ' + movie + '. Please look at the Alexa app for more info');
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
			} else {
				res.say('Here is what I found for ' + song + '. Please look at the Alexa app for more info');
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
