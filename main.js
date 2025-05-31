var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

var git = 0;
var pw = false;
let pwd = false;
let activeGame = null;
var commands = [];

setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }

  if (pw) {
    let et = "*";
    let w = textarea.value.length;
    command.innerHTML = et.repeat(w);
    if (textarea.value === password) {
      pwd = true;
    }
    if (pwd && e.keyCode == 13) {
      loopLines(secret, "color2 margin", 120);
      command.innerHTML = "";
      textarea.value = "";
      pwd = false;
      pw = false;
      liner.classList.remove("password");
    } else if (e.keyCode == 13) {
      addLine("Wrong password", "error", 0);
      command.innerHTML = "";
      textarea.value = "";
      pw = false;
      liner.classList.remove("password");
    }
  } else {
    if (e.keyCode == 13) {
      const input = command.innerHTML;
      commands.push(input);
      git = commands.length;

      addLine("friend@ianwatkins.pro:~$ " + input, "no-animation", 0);

      if (input === "jk") {
        clearToBanner();
        activeGame = null; // Reset active game
        command.innerHTML = "";
        textarea.value = "";
        return;
      }

      if (activeGame && typeof activeGame.handleInput === "function") {
        activeGame.handleInput(input.trim());
      } else {
        commander(input.toLowerCase());
      }

      command.innerHTML = "";
      textarea.value = "";
    }

    if (e.keyCode == 38 && git != 0) {
      git -= 1;
      textarea.value = commands[git];
      command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
      git += 1;
      if (commands[git] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = commands[git];
      }
      command.innerHTML = textarea.value;
    }
  }
}

function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "about":
      loopLines(about, "color2 margin", 80);
      break;
    case "whoami":
      loopLines(whoami, "color2 margin", 80);
      break;

    case "jk":
      clearToBanner();
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;

    case "projects":
      loopLines(projects, "color2 margin", 80);
      break;

    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine(
        'Opening mailto:<a href="mailto:info@ianwatkins.dev">info@ianwatkins.dev/a>...',
        "color2",
        80,
      );
      newTab(email);
      break;
    case "clear":
      setTimeout(function () {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "banner":
      loopLines(banner, "", 80);
      break;
    // socials
    case "linkedin":
      addLine("Opening LinkedIn...", "color2", 0);
      newTab(linkedin);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    default:
      addLine(
        '<span class="inherit">Command not found. For a list of commands, type <span class="command">\'help\'</span>.</span>',
        "error",
        100,
      );
      break;

    case "games":
      //loopLines(games, "color2 margin", 80);
      showGameMenu();
      break;

    case "story":
      loopLines(story, "color2 margin", 80);
      break;
  }
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function () {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}

function showGameMenu() {
  addLine("<br>", "", 0);
  addLine("Available Games:", "color2", 0);
  addLine("1. Hangman", "color2", 80);
  addLine("2. ??? Coming Soon...", "color2", 160);

  addLine(
    "Type the number of the game to start or <span class=\"command\">'jk'</span> to exit.",
    "color2",
    160,
  );
  activeGame = {
    handleInput: function (input) {
      if (input === "jk") {
        clearToBanner();
        activeGame = null; // Reset active game
        return;
      }
      if (input === "1") {
        import("./games/hangman/index.js").then((mod) => {
          //addLine("Starting Hangman...", "color2", 0);
          mod.startHangman(setGameHandler, endGame);
        });
        //activeGame = null; // Reset to allow the game to take over
      } else {
        addLine("Invalid selection. Type 'games' to try again.", "error", 0);
        activeGame = null;
      }
    },
  };
}

function setGameHandler(handler) {
  activeGame = handler;
}

function clearToBanner() {
  const bannerHTML = terminal.innerHTML;
  const bannerStart = bannerHTML.indexOf("██╗"); // start of your ASCII banner
  if (bannerStart >= 0) {
    const bannerLines = bannerHTML.substring(bannerStart);
    terminal.innerHTML = `<a id="before"></a>`;
    before = document.getElementById("before");
    loopLines(banner, "", 0); // re-display banner
  } else {
    terminal.innerHTML = '<a id="before"></a>';
    before = document.getElementById("before");
    loopLines(banner, "", 0);
  }
}

function endGame() {
  activeGame = null;
  addLine(
    "Game over! Type 'games' to play again or enter another command.",
    "color2",
    0,
  );
}
