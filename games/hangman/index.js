const terminal = document.getElementById("terminal");

const hangmanWords = [
  "hangman",
  "animation",
  "terminal",
  "whoami",
  "vector",
  "python",
  "golang",
  "javascript",
  "typescript",
  "neovim",
  "chmod",
  "sudo",
  "echo",
  "mkdir",
  "touch",
  "grep",
  "vim",
  "nvim",
  "brew",
  "curl",
  "wget",
  "kill",
  "tmux",
  "zsh",
  "bash",
  "fish",
  "cli",
  "repo",
  "commit",
  "merge",
  "branch",
  "pull",
  "push",
  "origin",
  "fork",
  "code",
  "build",
  "deploy",
  "lint",
  "test",
  "serve",
  "watch",
  "alias",
  "github",
  "mistbornone",
];

const hangmanPics = [
  `
   +---+
       |
       |
       |
      ===`,
  `
   +---+
   O   |
       |
       |
      ===`,
  `
   +---+
   O   |
   |   |
       |
      ===`,
  `
   +---+
   O   |
  /|   |
       |
      ===`,
  `
   +---+
   O   |
  /|\\  |
       |
      ===`,
  `
   +---+
   O   |
  /|\\  |
  /    |
      ===`,
  `
   +---+
   O   |
  /|\\  |
  / \\  |
      ===`,
];

let secretWord = "";
let guessedLetters = [];
let remainingTries = 6;
let endGameCallback = null;
let gameContainer = null;

export function startHangman(setHandler, endHandler) {
  secretWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  guessedLetters = [];
  remainingTries = 6;
  endGameCallback = endHandler;

  printGameUI();
  setHandler({ handleInput: guessLetter });
}

function guessLetter(input) {
  const letter = input.trim().toLowerCase();

  if (letter === "quit") {
    renderGameUI("👋 Exiting game.", true);
    endGameCallback();
    return;
  }

  if (letter.length !== 1 || !letter.match(/[a-z]/i)) {
    renderGameUI("❗ Please enter a single letter.");
    return;
  }

  if (guessedLetters.includes(letter)) {
    renderGameUI(`⚠️ You've already guessed "${letter}".`);
    return;
  }

  guessedLetters.push(letter);

  if (!secretWord.includes(letter)) {
    remainingTries--;
    renderGameUI(`❌ Wrong guess! ${remainingTries} tries left.`);
  } else {
    renderGameUI(`✅ Correct!`);
  }

  if (checkWin()) {
    renderGameUI(`🎉 You won! The word was "${secretWord}".`, true);
    endGameCallback();
  } else if (remainingTries <= 0) {
    renderGameUI(`💀 Game over! The word was "${secretWord}".`, true);
    endGameCallback();
  }
}

function printGameUI() {
  if (!gameContainer) {
    gameContainer = document.createElement("div");
    gameContainer.id = "hangman-ui";
    terminal.appendChild(gameContainer);
  }
  renderGameUI("Hangman");
}

function renderGameUI(message, freeze = false) {
  const art = hangmanPics[6 - remainingTries];
  const displayWord = secretWord
    .split("")
    .map((l) => (guessedLetters.includes(l) ? l : "_"))
    .join(" ");

  const remainingLetters = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .filter((l) => !guessedLetters.includes(l))
    .join(" ");

  gameContainer.innerHTML = `
    <pre>${art}</pre>
    <div><strong>Wrong guesses:</strong> ${6 - remainingTries}/6</div>
    <div><strong>Remaining:</strong> ${remainingLetters}</div>
    <div><strong>Word:</strong> ${displayWord}</div>
    <div style="margin-top: 1em;">${message}</div>
    ${!freeze ? '<div><span class="prompt">Guess a letter:</span></div>' : ""}
  `;

  terminal.scrollTop = terminal.scrollHeight;
}

function checkWin() {
  return secretWord.split("").every((l) => guessedLetters.includes(l));
}
