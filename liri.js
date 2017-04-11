//importing necessary libraries
var spotify = require('spotify');
var request = require('request');
var keys = require('./keys.js');
var twitter = require('twitter');
var fs = require('fs');

var twitterClient = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});


var command = process.argv[2];
var name = process.argv[3];

// Checking if command-argument is equal to "do-what-it-says"
// if yes run function which get command from text file
// else run function which accept command and name arguments
if (command === "do-what-it-says") {
    doTextFile();
} else {
    run(command, name);
}

// function which checking command-argument and run function according to that command
function run(command, name) {
    switch (command) {
        case 'my-tweets':
            getTweets();
            log('my-tweets\n');
            break;
        case 'spotify-this-song':
            getSong(name);
            log('spotify-this-song "' + name + '"\n');
            break;
        case 'movie-this':
            getMovie(name);
            log('movie-this "' + name + '"\n');
            break;
        default:
            console.log("Something wrong with your command!!!");
            break;
    }
}

// querying tweeter API
// logging data from tweeter api to terminal and log.txt file
function getTweets() {
    twitterClient.get('statuses/user_timeline', { count: 10 }, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(function(tweet) {
                console.log('*********************************************************** \n Created: ' + tweet.created_at + "\n" + "Tweet: " + tweet.text);
                log('Created: ' + tweet.created_at + "\n Tweet: " + tweet.text + "\n\n");
            });
        } else {
            log(error);
        }
    })
};

//querying spotify api
// logging data from spotify api to terminal and log.txt file
// function accept name of the song as an argument
function getSong(name) {

    // if name of the song isn't specified query api with default song name
    if (name === undefined) {
        name = 'The Sign Ace of Base';
    }
    spotify.search({ type: "track", query: name }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            log(err);
            return;
        } else {
            var songs = data.tracks.items;

            songs.forEach(function(song) {
                // console.log(JSON.stringify(song, null, 4));
                var artistsNames = "";
                song.artists.forEach(function(artist) {
                    artistsNames += artist.name + ", ";
                });
                console.log("Artists: " + artistsNames);
                console.log("Song name: " + song.name);
                console.log("Preview link: " + song.preview_url);
                console.log("Album name: " + song.album.name);
                console.log("*********************************************************************");
                log("Artists: " + artistsNames + "\n Song name: " + song.name + "\n Preview link: " + song.preview_url + "\n Album name: " + song.album.name + "\n\n");
            });
        }
    });
};

// querying omdb api
// logging data from omdb api to terminal and log.txt file
// function accept movie title as an argument
function getMovie(title) {

    // if title of the movie isn't specified query api with default movie title
    if (title === undefined) {
        title = 'Mr. Nobody';
    }
    request.get("http://www.omdbapi.com/?t=" + title + "&plot=full", (error, status, body) => {
        var bodyObj = JSON.parse(body);
        // var ratings = "";
        // data.Ratings.forEach(function(rating) {
        //     ratings += rating.Source + ", ";
        // });
        // console.log("Ratings: " + ratings);
        console.log("Title: " + bodyObj.Title);
        console.log("Year: " + bodyObj.Year);
        console.log("Rating: " + bodyObj.imdbRating);
        console.log("Country: " + bodyObj.Country);
        console.log("Language: " + bodyObj.Language);
        console.log("Plot: " + bodyObj.Plot);
        console.log("Actors: " + bodyObj.Actors);
        log("Title: " + bodyObj.Title + "\n Year: " + bodyObj.Year + "\n Rating: " + bodyObj.imdbRating + "\n Country: " + bodyObj.Country + "\n Language: " + bodyObj.Language + "\n Plot: " + bodyObj.Plot + "\n Actors: " + bodyObj.Actors + "\n\n")
    })
}

// function read command from random.txt file
// according to the command from text file run necessary function
function doTextFile() {
    var arg = fs.readFile("./random.txt", 'utf8', (error, text) => {
        if (!error) {
            command = text.split(',')[0];
            name = text.split(",")[1];
            run(command, name);
        } else {
            log(error);
        }
    });
}

// login data to log.txt file
function log(data) {
    fs.appendFile("log.txt", data, (err) => {
        if (err) {
            console.log(err);
        }
    });
}