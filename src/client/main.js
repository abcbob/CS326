import { Game } from "./game.js";
import { Rack } from "./rack.js";
import * as utils from "./scrabbleUtils.js";

const main = async () => {
  // UI Components
  const boardGridElement = document.getElementById("board");
  const playButtonElement = document.getElementById("play");
  const resetButtonElement = document.getElementById("reset-button");

  const rackElement = document.getElementById("rack");
  const helpButtonElement = document.getElementById("help-button");

  // Game Board
  const game = new Game();

  const rack = new Rack();
  rack.takeFromBag(7, game);
  rack.render(rackElement);

  game.render(boardGridElement);

  // We check to make sure the play button exists before adding the event
  // listener. You are to add the play button as part of this homework. If we do
  // not test if it exists, the code will break when running the tests. You can
  // safely remove this conditional after you add the play button.
  if (playButtonElement) {
    playButtonElement.addEventListener("click", async () => {
      // Get the DOM elements representing the UI components.
      const wordElement = document.getElementById("word");
      const xElement = document.getElementById("x");
      const yElement = document.getElementById("y");
      const directionElement = document.getElementById("direction");

      // Get the values from the UI components.
      const word = wordElement.value;
      const x = parseInt(xElement.value);
      const y = parseInt(yElement.value);
      const direction = directionElement.value === "horizontal";

      if (!utils.canConstructWord(rack.getAvailableTiles(), word)) {
        alert(
          `The word "${word}" cannot be constructed from the available tiles.`,
        );
        return;
      }

      // Check if the word is a valid word
      if (!(await utils.isValid(word))) {
        alert(`"${word}" is not a valid word.`);
        return;
      }

      // Try to play the word on the board.
      const result = game.playAt(word, { x, y }, direction);
      if (result === -1) {
        alert(
          `The word cannot be placed in a ${directionElement.value} position at coordinates(${x}), ${y}).`,
        );
        return;
      }

      const playableWord = utils
        .constructWord(rack.getAvailableTiles(), word)
        .join("");
      playableWord.split("").forEach((tile) => rack.removeTile(tile));
      rack.takeFromBag(playableWord.length, game);
      rack.render(rackElement);

      game.render(boardGridElement);
      wordElement.value = "";
      xElement.value = "";
      yElement.value = "";

      const hintElement = document.getElementById("hint");
      hintElement.innerText = "";
    });
  } else {
    throw new Error("Could not find play button");
  }

  if (!resetButtonElement) {
    throw new Error("Reset button not found");
  } else {
    resetButtonElement.addEventListener("click", () => {
      game.reset();
      game.render(boardGridElement);
      rack.reset();
      rack.takeFromBag(7, game);
      rack.render(rackElement);
    });
  }

  helpButtonElement.addEventListener("click", async () => {
    const possibilities = await utils.bestPossibleWords(
      rack.getAvailableTiles(),
    );
    const hint =
      possibilities[Math.floor(Math.random() * possibilities.length)];
    const hintElement = document.getElementById("hint");
    hintElement.innerText = hint;
  });
};

main();
