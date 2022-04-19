const MAX_GUESSES: number = 6;
const WORD_LENGTH: number = 5;
const wordGuesses: string[][] = [];
let currentGuess: Array<string> = [];
let wordToGuess: string;
// Keyboard is locked during fetch request and when the game finishes
let isKeyboardLocked: boolean = false;
let hasGameFinished: boolean = false;
const KEYBOARD_ENGLISH_QWERTY_LAYOUT: Array<string> = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm"
];
const KEYBOARD_SPANISH_QWERTY_LAYOUT: Array<string> = [
    "qwertyuiop",
    "asdfghjklñ",
    "zxcvbnm"
];
// Object containing {"character" : HTMLElement}
const keyboardKeys: Object = {}; 

const popupMessageLoading: HTMLElement = document.querySelector("#message-loading");
const popupMessageInvalidWord: HTMLElement = document.querySelector("#message-invalid-word");
const popupMessageInvalidLength: HTMLElement = document.querySelector("#message-invalid-length");



/*
 *  INITIAL WORDS
 */
// I plan to develop an API to return a word to the application.
const WORD_BANK_5_LETTER = ["about", "above", "abuse", "actor", "acute", "admit", "adopt", "adult", "after", "again", "agent", "agree", "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone", "along", "alter", "among", "anger", "angle", "angry", "apart", "apple", "apply", "arena", "argue", "arise", "array", "aside", "asset", "audio", "audit", "avoid", "award", "aware", "badly", "baker", "bases", "basic", "basis", "beach", "began", "begin", "begun", "being", "below", "bench", "billy", "birth", "black", "blame", "blind", "block", "blood", "board", "boost", "booth", "bound", "brain", "brand", "bread", "break", "breed", "brief", "bring", "broad", "broke", "brown", "build", "built", "buyer", "cable", "calif", "carry", "catch", "cause", "chain", "chair", "chart", "chase", "cheap", "check", "chest", "chief", "child", "china", "chose", "civil", "claim", "class", "clean", "clear", "click", "clock", "close", "coach", "coast", "could", "count", "court", "cover", "craft", "crash", "cream", "crime", "cross", "crowd", "crown", "curve", "cycle", "daily", "dance", "dated", "dealt", "death", "debut", "delay", "depth", "doing", "doubt", "dozen", "draft", "drama", "drawn", "dream", "dress", "drill", "drink", "drive", "drove", "dying", "eager", "early", "earth", "eight", "elite", "empty", "enemy", "enjoy", "enter", "entry", "equal", "error", "event", "every", "exact", "exist", "extra", "faith", "false", "fault", "fiber", "field", "fifth", "fifty", "fight", "final", "first", "fixed", "flash", "fleet", "floor", "fluid", "focus", "force", "forth", "forty", "forum", "found", "frame", "frank", "fraud", "fresh", "front", "fruit", "fully", "funny", "giant", "given", "glass", "globe", "going", "grace", "grade", "grand", "grant", "grass", "great", "green", "gross", "group", "grown", "guard", "guess", "guest", "guide", "happy", "harry", "heart", "heavy", "hence", "henry", "horse", "hotel", "house", "human", "ideal", "image", "index", "inner", "input", "issue", "japan", "jimmy", "joint", "jones", "judge", "known", "label", "large", "laser", "later", "laugh", "layer", "learn", "lease", "least", "leave", "legal", "level", "lewis", "light", "limit", "links", "lives", "local", "logic", "loose", "lower", "lucky", "lunch", "lying", "magic", "major", "maker", "march", "maria", "match", "maybe", "mayor", "meant", "media", "metal", "might", "minor", "minus", "mixed", "model", "money", "month", "moral", "motor", "mount", "mouse", "mouth", "movie", "music", "needs", "never", "newly", "night", "noise", "north", "noted", "novel", "nurse", "occur", "ocean", "offer", "often", "order", "other", "ought", "paint", "panel", "paper", "party", "peace", "peter", "phase", "phone", "photo", "piece", "pilot", "pitch", "place", "plain", "plane", "plant", "plate", "point", "pound", "power", "press", "price", "pride", "prime", "print", "prior", "prize", "proof", "proud", "prove", "queen", "quick", "quiet", "quite", "radio", "raise", "range", "rapid", "ratio", "reach", "ready", "refer", "right", "rival", "river", "robin", "roger", "roman", "rough", "round", "route", "royal", "rural", "scale", "scene", "scope", "score", "sense", "serve", "seven", "shall", "shape", "share", "sharp", "sheet", "shelf", "shell", "shift", "shirt", "shock", "shoot", "short", "shown", "sight", "since", "sixth", "sixty", "sized", "skill", "sleep", "slide", "small", "smart", "smile", "smith", "smoke", "solid", "solve", "sorry", "sound", "south", "space", "spare", "speak", "speed", "spend", "spent", "split", "spoke", "sport", "staff", "stage", "stake", "stand", "start", "state", "steam", "steel", "stick", "still", "stock", "stone", "stood", "store", "storm", "story", "strip", "stuck", "study", "stuff", "style", "sugar", "suite", "super", "sweet", "table", "taken", "taste", "taxes", "teach", "teeth", "terry", "texas", "thank", "theft", "their", "theme", "there", "these", "thick", "thing", "think", "third", "those", "three", "threw", "throw", "tight", "times", "tired", "title", "today", "topic", "total", "touch", "tough", "tower", "track", "trade", "train", "treat", "trend", "trial", "tried", "tries", "truck", "truly", "trust", "truth", "twice", "under", "undue", "union", "unity", "until", "upper", "upset", "urban", "usage", "usual", "valid", "value", "video", "virus", "visit", "vital", "voice", "waste", "watch", "water", "wheel", "where", "which", "while", "white", "whole", "whose", "woman", "women", "world", "worry", "worse", "worst", "worth", "would", "wound", "write", "wrong", "wrote", "yield", "young", "youth"]

// In the future this function will be an API call to retrieve a word
function getRandomWordToGuess(wordLength= 5): string {
    if (wordLength === 5)
        return WORD_BANK_5_LETTER[Math.floor(Math.random() * WORD_BANK_5_LETTER.length)];
}


/*
 *  GENERATION OF DOM ELEMENTS
 */
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

    // Append a new container for each row in the keyboard
    for (let row of keyboardLayout) {
        console.log(`Generating the row ${row}`);

        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row-container");
        keyboardContainer.appendChild(rowContainer);

        // Append as many keys as the number of letters in the row
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

/*
 *  DOM ELEMENT LOGIC
 */
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


/*
 *  GAME LOGIC
 */
function handleKeyPressed(letter: string): void {

    if (isKeyboardLocked) return;
    if (hasGameFinished) return;

    console.log(`${letter} was pressed`);
    console.log("Current guess is", currentGuess, " with a length of ", currentGuess.length);
    console.log("Current word guesses is", wordGuesses, " with a length of ", wordGuesses.length);

    if (currentGuess.length < WORD_LENGTH && wordGuesses.length < MAX_GUESSES) {
        console.log("Letter submission is valid, inserting");
        currentGuess.push(letter);
        const targetCard = document.querySelector(`[row='${wordGuesses.length}'][col='${currentGuess.length - 1}']`);
        targetCard.innerHTML = `<span>${letter}</span>`
        targetCard.classList.add("active-card");
    } else
        console.log("Letter submission is not valid, ignoring");

    console.log("Current guess is now", currentGuess, " with a length of ", currentGuess.length);
}

function handleWordSubmission(): void {
    console.log("The submit button was pressed")
    if (isKeyboardLocked) {
        console.log("The keyboard is locked. Waiting for a request?");
        return;
    }
    if (hasGameFinished || wordGuesses.length >= MAX_GUESSES) {
        alert("The game has ended")
        return
    }
    if (currentGuess.length !== WORD_LENGTH) {
        console.log("The submitted word length is not valid");
        popupMessageInvalidLength.classList.add("message-show");
        setTimeout(() => {
            unlockKeyboard();
        }, 500);
        return;
    }

    console.log("The submitted word length is valid, checking");
    popupMessageLoading.classList.add("message-show");
    lockKeyboard();
    const wordToString: string = currentGuess.reduce((a, b) => a + b).toLowerCase();
    console.log(`Sending the request ${wordToString} to test the word`)
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToString}`)
        .then(response => {
            console.log(response);
            if (!response.ok)
                throw Error("Word not found");
            console.log("The word is valid, submitting the guess");
            submitWord(currentGuess);
        })
        .catch((err) => {
            console.error(err)
            if (err.message === "Word not found") {
                console.log("The word is invalid, ignoring");
                popupMessageInvalidWord.classList.add("message-show");
                setTimeout(() => unlockKeyboard(), 400);
            } else {
                console.log("An error ocurred", err);
            }
        })
}

function lockKeyboard(): void {
    isKeyboardLocked = true;
}

function unlockKeyboard(): void {
    popupMessageLoading.classList.remove("message-show");
    popupMessageInvalidLength.classList.remove("message-show");
    popupMessageInvalidWord.classList.remove("message-show");
    isKeyboardLocked = false;
}

function submitWord(word: Array<string>): void {
    console.log("> Submitting word")
    wordGuesses.push(word);
    displaySubmittedWord();
    unlockKeyboard();
    console.log("Checking for ending clauses")
    // Check if the guess is correct and then end the game 
    if (currentGuess.reduce((a, b) => a + b).toLowerCase() === wordToGuess.toLowerCase()) {
        hasGameFinished = true;
        openModalWin();
        lockKeyboard();
        return;
    }
    // Check if the player has run out of guesses and end the game
    if (wordGuesses.length === MAX_GUESSES) {
        hasGameFinished = true;
        openModalLoss();
        lockKeyboard();
        return;
    }
    currentGuess = [];
}

function displaySubmittedWord(): void {
    console.log("Displaying the submitted word");

    // Color the current row accordingly 
    // Get the row where the word is submitted from
    const rows = document.querySelectorAll("#board .row-container");
    console.log("rows",rows)
    const currentRow = rows[wordGuesses.length-1];
    console.log("currentRow",currentRow)
    // Analyze letter by letter and color each card accordingly
    const cards = [...currentRow.children];
    console.log("cards",cards)
    for (let card of cards) {
        console.log("card",card)
        // Get the index of the card
        const currentIndex: number = Number((<HTMLElement>card).getAttribute("col"));
        console.log("currentIndex",currentIndex)
        // Get the letter in the card
        const currentLetter: string = (<HTMLElement>card.children[0]).innerText;
        console.log("currentLetter",currentLetter)

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
        (<HTMLElement>card).classList.add(finalCardColor);
        (<HTMLElement>card).classList.remove("active-card");
        (<HTMLElement>keyboardKeys[currentLetter]).classList.add(finalCardColor);
    }
    console.log("Finished displaying word")
}

function handleLetterDeletion(): void {
    console.log("The delete button was pressed")
    if (isKeyboardLocked) {
        console.log("The keyboard is locked. Waiting for a request?");
        return;
    };
    if (wordGuesses.length < MAX_GUESSES && currentGuess.length > 0) {
        const targetCard = document.querySelector(`[row='${wordGuesses.length}'][col='${currentGuess.length - 1}']`);
        targetCard.innerHTML = "";
        targetCard.classList.remove("active-card");

        currentGuess.pop();
    }
}

/*
 * HANDLE KEYBOARD INPUTS
 */
document.addEventListener('keydown', (event) => {
    let keyName: string = event.key.toLowerCase();
    console.log("A key was pressed", event)
    if (hasGameFinished) return
    if (keyName.match(/[a-z]/) && keyName.length === 1) {
        console.log("It's a letter")
        handleKeyPressed(keyName.toUpperCase());
    }
    if (keyName === "enter") {
        console.log("It's Enter")
        handleWordSubmission();
    }
    if (keyName === "backspace" || keyName === "delete") {
        console.log("It's delete")
        handleLetterDeletion();
    }
});


/*
 *  MODAL MANAGEMENT
 */

function openModalWin() {
    console.log("Inside open modal win")

    // Retrieve all the modal elements and insert the text
    const modalTitle: HTMLElement = document.querySelector("#modal-title");
    modalTitle.innerHTML = "Congratulations";
    modalTitle.classList.add("modal-okay")
    const modalP1: HTMLElement = document.querySelector("#modal-p1");
    modalP1.innerHTML = "You guessed the word:";
    const modalP2: HTMLElement = document.querySelector("#modal-p2");
    modalP2.innerHTML = `in ${wordGuesses.length} attempts`;
    const modalWord: HTMLElement = document.querySelector("#modal-word");
    modalWord.innerHTML = wordToGuess.toUpperCase();


    // Retrieve the replay buttons and assign its event listener
    const modalButton:HTMLElement = document.querySelector("#modal-replay");
    modalButton.addEventListener("click", () => {
        window.location.reload();
    });
    modalButton.focus();

    // Make the modal visible
    const modalBackground: HTMLElement = document.querySelector("#modal-backdrop");
    modalBackground.style.opacity = "100%";
    modalBackground.style.visibility = "visible";
}


function openModalLoss() {
    console.log("Inside open modal loss")

    // Retrieve all the modal elements and insert the text
    const modalTitle: HTMLElement = document.querySelector("#modal-title");
    modalTitle.innerHTML = "Game ended";
    modalTitle.classList.add("modal-dark")
    const modalP1: HTMLElement = document.querySelector("#modal-p1");
    modalP1.innerHTML = "The word was:";
    const modalP2: HTMLElement = document.querySelector("#modal-p2");
    modalP2.innerHTML = "Try again";
    const modalWord: HTMLElement = document.querySelector("#modal-word");
    modalWord.innerHTML = wordToGuess.toUpperCase();


    // Retrieve the replay buttons and assign its event listener
    const modalButton:HTMLElement = document.querySelector("#modal-replay");
    modalButton.addEventListener("click", () => {
        window.location.reload();
    });
    modalButton.focus();

    // Make the modal visible
    const modalBackground: HTMLElement = document.querySelector("#modal-backdrop");
    modalBackground.style.opacity = "100%";
    modalBackground.style.visibility = "visible";
}

/*
 *  GAME START
 */
generateGameBoard(MAX_GUESSES, WORD_LENGTH);

generateKeyboard(KEYBOARD_ENGLISH_QWERTY_LAYOUT);

assignButtonHandlers();

wordToGuess = getRandomWordToGuess();