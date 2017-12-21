"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rx = require("rxjs");
var helpers_1 = require("../helpers");
function getJokes(event) {
    var minRating = (event.queryStringParameters && event.queryStringParameters.rating) ? parseFloat(event.queryStringParameters.rating) : 0;
    var filteredJokes = jokesList().filter(function (joke) { return joke.rating >= minRating; });
    return rx.Observable.of(filteredJokes);
}
exports.getJokes = getJokes;
function getRandomJoke(event) {
    var jokes = jokesList();
    return rx.Observable.of(jokes[Math.floor(Math.random() * jokes.length)]);
}
exports.getRandomJoke = getRandomJoke;
function createJoke(event) {
    return rx.Observable.of(helpers_1.parseJSON(event.body));
}
exports.createJoke = createJoke;
//Thanks to: http://onelinefun.com/
function jokesList() {
    return [
        {
            content: "People don't get my puns. They think they're funny.",
            rating: Math.floor(Math.random() * 6)
        },
        {
            content: "Life is all about perspective. The sinking of the Titanic was a miracle to the lobsters in the ship's kitchen.",
            rating: Math.floor(Math.random() * 6)
        },
        {
            content: "She wanted a puppy. But I didn't want a puppy. So we compromised and got a puppy",
            rating: Math.floor(Math.random() * 6)
        }
    ];
}
//# sourceMappingURL=jokes.core.api.js.map