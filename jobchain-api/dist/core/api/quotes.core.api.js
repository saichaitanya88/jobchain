"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rx = require("rxjs");
function getQuotes(event) {
    return rx.Observable.of(quotesList());
}
exports.getQuotes = getQuotes;
//Thank to: https://www.brainyquote.com/quotes/topics/topic_amazing.html
function quotesList() {
    return [
        {
            content: "Nothing is work unless you'd rather be doing something else.",
            author: "George Halas"
        },
        {
            content: "All the rivers run into the sea; yet the sea is not full.",
            author: "King Solomon"
        },
        {
            content: "Love and desire are the spirit's wings to great deeds.",
            author: "Johann Wolfgang von Goethe"
        },
        {
            content: "I rarely draw what I see. I draw what I feel in my body.",
            author: "Barbara Hepworth"
        },
        {
            content: "The secrets of success are a good wife and a steady job. My wife told me.",
            author: "Howard Nemerov"
        }
    ];
}
//# sourceMappingURL=quotes.core.api.js.map