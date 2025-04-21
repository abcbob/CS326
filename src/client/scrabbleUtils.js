// This module contains utility functions for the scrabble game.

// This imports the dictionary of scrabble words.
import Dictionary from "./dictionary.js";
const dictionary = Dictionary("/dictionary.json");

/**
 * This function checks whether a given word can be constructed with the
 * available tiles. The availableTiles object should not be modified.
 *
 * @param {object} availableTiles The available tiles to use.
 * @param {string} word The word to check.
 * @returns {boolean} Returns true if the word can be constructed with the given
 *                    tiles; false otherwise.
 */
function canConstructWord(availableTiles, word) {
  const copy = {};
  for (let letter in availableTiles) {
    copy[letter] = availableTiles[letter];
  }

  for (let letter of word) {
    if (letter in copy) {
      --copy[letter];

      if (copy[letter] === 0) {
        delete copy[letter];
      }
    } else {
      if ("*" in copy) {
        --copy["*"];

        if (copy["*"] === 0) {
          delete copy["*"];
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

/**
 * This function tris to build a word given a set of available tiles. It will
 * prioritize letter tiles over wildcards. It will return the list of tiles
 * used, or null if the word is not constructible with the given tiles.
 *
 * @param {Object<string, number>} availableTiles A collection of available
 * tiles and their amount.
 * @param {string} word The word a player wants to construct.
 * @returns {Array<string>} The letters used to construct the word, or null if
 * it is not constructible with the tiles.
 */
function constructWord(availableTiles, word) {
  const copy = {};
  for (let letter in availableTiles) {
    copy[letter] = availableTiles[letter];
  }

  const tiles = [];

  for (let letter of word) {
    if (letter in copy) {
      tiles.push(letter);
      --copy[letter];

      if (copy[letter] === 0) {
        delete copy[letter];
      }
    } else {
      if ("*" in copy) {
        tiles.push("*");
        --copy["*"];

        if (copy["*"] === 0) {
          delete copy["*"];
        }
      } else {
        return null;
      }
    }
  }

  return tiles;
}

/**
 * We define the base score of a word the score obtained by adding each letter's
 * score, without taking board position into account. This function will compute
 * and return the base score of a given word.
 *
 * @param {string} word The word to compute a base score for.
 * @returns {number} The base score of the given word.
 */
function baseScore(word) {
  const scores = {
    "*": 0,
    a: 1,
    b: 3,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 1,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10,
  };

  let score = 0;

  for (let letter of word) {
    score += scores[letter];
  }

  return score;
}

/**
 * Finds and returns every word from the dictionary that can be constructed with
 * the given tiles.
 *
 * @param {object} availableTiles The available tiles to use.
 * @returns {string[]} The words that can be constructed with the given tiles.
 */
async function possibleWords(availableTiles) {
  const possibilities = [];

  // Let n be the size of the dictionary, m be the number of tiles in hand. This
  // implementation is not the fastest, O(nm). We could use permutations which
  // would execute in O(m!). It would theoretically be faster, since in standard
  // Scrabble, m is constant and equals 7. This other method would however scale
  // really bad with many wildcard tiles.
  // TASK #5: Fix the following code to use the new dictionary object.
  //          Remember, you need to call the get method to retrieve the
  //          dictionary words.
  const Data = await dictionary.get();
  //console.log(Data);
  const d = Data.data;
  for (let word of d) {
    if (canConstructWord(availableTiles, word)) {
      possibilities.push(word);
    }
  }

  return possibilities;
}

/**
 * Finds and returns the word(s) with the highest base score from the
 * dictionary, given a set of available tiles.
 *
 * @param {object} availableTiles The available tiles to use.
 * @returns {string[]} The words with the highest base score.
 */
async function bestPossibleWords(availableTiles) {
  const possibilities = await possibleWords(availableTiles);

  let suggestions = [];
  let max = -1;

  for (let word of possibilities) {
    const score = baseScore(constructWord(availableTiles, word).join(""));
    if (score > max) {
      max = score;
      suggestions = [word];
    } else if (score === max) {
      suggestions.push(word);
    }
  }

  return suggestions;
}

/**
 * Checks if a given word is valid based on a predefined dictionary.
 *
 * This function supports wildcard characters represented by '*'. Wildcards can
 * be replaced with any letter from 'a' to 'z'. A word without wildcards is
 * considered valid if it directly exists within the dictionary. For words with
 * one or more wildcards, each wildcard is replaced with every possible letter
 * (from 'a' to 'z') to check if a valid word can be formed that exists in the
 * dictionary.
 *
 * @param {string} word - The word to be checked for validity. The word may
 * contain zero or more '*' characters as wildcards.
 * @returns {boolean} - Returns `true` if the word is found in the dictionary or
 * if a valid word can be formed by replacing wildcards with any letter;
 * otherwise, returns `false`.
 *
 * @example
 * /// Suppose the dictionary contains ["apple", "apply", "cat", "dog"]
 * console.log(await isValid("apple")); // true
 * console.log(await isValid("a*ple")); // true
 * console.log(await isValid("****"));  // false (no 4-letter words in dictionary)
 * console.log(await isValid("d*g"));   // true
 */
async function isValid(word) {
  // if the word has no wildcard, then we just check if it is in the dictionary.
  const Data = await dictionary.get();
  console.log(Data);
  const d = Data.data;
  if (!word.includes("*")) {
    // TASK #6: Fix the following code to use the new dictionary object.
    //          Remember, you need to call the get method to retrieve the
    //          dictionary words.
    return d.includes(word);
  }

  // if it does have one or more wildcard, we replace the first one by every
  // possible character, and recurse.
  for (let i = 0; i < 26; ++i) {
    const letter = String.fromCharCode("a".charCodeAt(0) + i);
    // replace only replaces the first occurence of *.
    const validWord = await isValid(word.replace("*", letter));
    if (validWord) {
      return validWord;
    }
  }

  return false;
}

// This exports our public functions.
export {
  canConstructWord,
  constructWord,
  baseScore,
  possibleWords,
  bestPossibleWords,
  isValid,
};
