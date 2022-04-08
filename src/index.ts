let wordToGuess: string;
const MAX_GUESSES: number = 6;
const WORD_LENGTH: number = 5;
const wordGuesses: string[][] = [];
let currentGuess: Array<string> = [];

const ENGLISH_QWERTY_LAYOUT: Array<string> = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm"
];

const SPANISH_QWERTY_LAYOUT: Array<string> = [
    "qwertyuiop",
    "asdfghjklñ",
    "zxcvbnm"
];

function generateGameBoard(rows: number, cols: number): void {

    const gameBoardContainer = document.getElementById("board");
    console.log(gameBoardContainer, typeof (gameBoardContainer));

    let row: number, col: number;
    for (row = 0; row < rows; row++) {

        // Append a new container for each attempt the player has
        console.log(`Generating the row ${row}`);
        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row-container");
        gameBoardContainer.appendChild(rowContainer);

        // Append as many squares as the number of letters in the word to guess
        for (col = 0; col < cols; col++) {

            // console.log(`Generating the square ${col} on the row ${row}`);
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("row", row.toString());
            card.setAttribute("col", col.toString());

            rowContainer.appendChild(card);
        }
    }
}

function generateKeyboard(keyboardLayout: Array<string>): void {
    const keyboardContainer = document.getElementById("keyboard");

    // Append a new container for each attempt the player has 
    for (let row of keyboardLayout) {
        console.log(`Generating the row ${row}`);

        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row-container");
        keyboardContainer.appendChild(rowContainer);

        // Append as many squares as the number of letters in the word to guess
        for (let char of row) {
            // console.log(`Generating the key ${char} on the row ${row}`);

            const key = document.createElement("button");
            key.innerText = char.toUpperCase();

            key.classList.add("key");
            key.setAttribute("key", char.toUpperCase());

            rowContainer.appendChild(key);
        }
    }
}

function assignButtonHandlers(): void {
    console.log("Assigning the handlers to the keyboard keys");
    const keys = document.querySelectorAll(".key");
    for (let key of keys) {
        let keyElement = key as HTMLElement;
        keyElement.onclick = () => handleKeyPressed(keyElement.getAttribute("key"));
    }

    console.log("Assigning the handler to the submit button");
    const submitButton: HTMLElement = document.querySelector("#submitButton");
    console.log(submitButton)
    submitButton.onclick = () => handleWordSubmission();

    console.log("Assigning the handler to the delete button");
    const deleteButton: HTMLElement = document.querySelector("#deleteButton");
    deleteButton.onclick = () => handleLetterDeletion();
}

function handleKeyPressed(letter: string): void {
}

function handleWordSubmission(): void {
}

function handleLetterDeletion(): void {
}

generateGameBoard(MAX_GUESSES, WORD_LENGTH);
generateKeyboard(ENGLISH_QWERTY_LAYOUT);
assignButtonHandlers();