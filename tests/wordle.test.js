/**
 * @jest-environment jsdom
 */
const { getRandomWordToGuess } = require("../dist/index.js")

test('getRandomWordToGuess retreives a 5-letter word', () => {
    wordLength = 5;
    wordReceived = getRandomWordToGuess(wordLength);
    console.log(wordReceived)
    expect(wordReceived).toMatch(/[a-z]{5}/);
});