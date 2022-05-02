/**
 * @jest-environment jsdom
 */
const { getRandomWordToGuess, compareWords } = require("../dist/index.js")

test('getRandomWordToGuess retreives a 5-letter word', () => {
    wordLength = 5;
    wordReceived = getRandomWordToGuess(wordLength);
    console.log(wordReceived)
    expect(wordReceived).toMatch(/[a-z]{5}/);
});

test("compareWords should find a correct word completely correct", () => {
    expect(compareWords([..."human"], "human")).toEqual([2, 2, 2, 2, 2])
})

test("compareWords should find a completely incorrect word completely incorrect", () => {
    expect(compareWords([..."human"], "rodeo")).toEqual([0, 0, 0, 0, 0])
})

test("compareWords should find a partially incorrect word partially incorrect", () => {
    expect(compareWords([..."human"], "month")).toEqual([1, 0, 1, 0, 1])
})

test("compareWords should find a partially incorrect word partially incorrect 2", () => {
    expect(compareWords([..."human"], "month")).toEqual([1, 0, 1, 0, 1])
})

test("compareWords should find a partially incorrect word partially incorrect 2", () => {
    expect(compareWords([..."lucky"], "lunch")).toEqual([2, 2, 1, 0, 0])
})