let wordToGuess: string;
const MAX_GUESSES: number = 6;
const WORD_LENGTH: number = 5;
const wordGuesses: string[][] = [];
let currentGuess: Array<string> = [];
let gameFinishedFlag: boolean = false;
const keyboardKeys: Object = {};

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

            keyboardKeys[char.toUpperCase()] = (key)
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
    submitButton.onclick = () => handleWordSubmission();

    console.log("Assigning the handler to the delete button");
    const deleteButton: HTMLElement = document.querySelector("#deleteButton");
    deleteButton.onclick = () => handleLetterDeletion();
}

function handleKeyPressed(letter: string): void {

    // If the game has finished do not allow more attempts
    if (gameFinishedFlag) return;

    console.log(`${letter} was pressed`);
    console.log("Current guess is", currentGuess, " with a length of ", currentGuess.length);
    console.log("Current word guesses is", wordGuesses, " with a length of ", wordGuesses.length);

    if (currentGuess.length < WORD_LENGTH && wordGuesses.length < MAX_GUESSES) {
        console.log("Letter submission is valid, inserting");
        currentGuess.push(letter);
        const targetCard = document.querySelector(`[row='${wordGuesses.length}'][col='${currentGuess.length - 1}']`);
        targetCard.innerHTML = `<span>${letter}</span>`

    } else
        console.log("Letter submission is not valid, ignoring");

    console.log("Current guess is now", currentGuess, " with a length of ", currentGuess.length);

}

function handleWordSubmission(): void {
    console.log("The submit button was pressed")
    if (gameFinishedFlag || wordGuesses.length >= MAX_GUESSES) {
        alert("The game has ended")
        return
    }
    if (currentGuess.length !== WORD_LENGTH) {
        alert("The submitted word length is not valid");
        console.log("The submitted word length is not valid");
        return;
    }

        console.log("The submitted word length is valid, checking");
        if (isWordValid(currentGuess)) {
            console.log("The word is valid, submitting");
            submitWord(currentGuess);
        } else
        console.log("The word is in valid, ignoring");

}

function isWordValid(word: Array<string>): boolean {
    return true;
}

function submitWord(word: Array<string>): void {
    checkSubmittedWord();
    wordGuesses.push(word);
    currentGuess = [];
}

function checkSubmittedWord(): void {
    console.log("Checking submitted word");

    // Color the current row accordingly 
    // Get the row where the word is submitted from
    const rows = document.querySelectorAll("#board .row-container");
    const currentRow = rows[wordGuesses.length];

    // Analyze letter by letter and color each card accordingly
    const cards = [...currentRow.children];
    for (let card of cards) {
        // Get the index of the card
        const currentIndex = Number((<HTMLElement>card).getAttribute("col"));
        // Get the letter in the card
        const currentLetter: string = (<HTMLElement>card.children[0]).innerText;

        // Set the color of the card to an initial value
        let finalCardColor: string = "dark-gray";
        // If the original word contains this letter
        console.log(`Comparing the letter ${currentLetter} to the word to guess "${wordToGuess}"`);
        const letterPosition: number = wordToGuess.toLowerCase().indexOf(currentLetter.toLowerCase());
        if (letterPosition > -1) {
            finalCardColor = "yellow";
            // If the original word contains this letter in the same position
            if (currentLetter.toLowerCase() === wordToGuess[currentIndex].toLowerCase())
                finalCardColor = "green"
        }
        (<HTMLElement>card).classList.toggle(finalCardColor);
        (<HTMLElement>keyboardKeys[currentLetter]).classList.add(finalCardColor);
    }

    // Check if the guess is correct and then end the game 
    if (currentGuess.reduce((a, b) => a + b).toLowerCase() === wordToGuess.toLowerCase()) {
        gameFinishedFlag = true;
        alert("You've won the game");
    }
}

function handleLetterDeletion(): void {
    console.log("The delete button was pressed")
    if (wordGuesses.length < MAX_GUESSES && currentGuess.length > 0) {
        const targetCard = document.querySelector(`[row='${wordGuesses.length}'][col='${currentGuess.length - 1}']`);
        targetCard.innerHTML = "";
        currentGuess.pop();
    }
}

generateGameBoard(MAX_GUESSES, WORD_LENGTH);
generateKeyboard(ENGLISH_QWERTY_LAYOUT);
assignButtonHandlers();