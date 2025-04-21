import { Store } from "./store.js";

/**
 * Represents a rack of tiles for the game of Scrabble.
 */
export class Rack {
  /**
   * Constructs a new Rack instance.
   */
  constructor() {
    /**
     * An object to keep track of available tiles. The keys are the letters of
     * the tiles, and the values are the number of those tiles available.
     * @type {Object.<string, number>}
     */
    this.available = {};
    const store = Store.store();
    if (store.has("rack")) {
      this.available = store.get("rack");
    }

    /**
     * The total number of tiles available on the rack.
     * @type {number}
     */
    this.count = Object.values(this.available).reduce(
      (acc, val) => acc + val,
      0,
    );
  }

  /**
   * Retrieves the currently available tiles on the rack.
   * @returns {Object.<string, number>} The available tiles.
   */
  getAvailableTiles() {
    // Return a copy of the available tiles to prevent the original object from
    // being modified.
    return { ...this.available };
  }

  /**
   * Renders the current state of the rack to a specified DOM element. Each tile
   * is represented as a div element with the class `grid-item` and text content
   * set to the letter of the tile.
   * @param {Element} element - The DOM element to render the tiles into.
   */
  render(element) {
    element.innerHTML = "";

    for (const letter in this.available) {
      for (let i = 0; i < this.available[letter]; ++i) {
        const div = document.createElement("div");
        div.classList.add("grid-item");
        div.innerText = letter;
        element.appendChild(div);
      }
    }
  }

  /**
   * Attempts to remove a single tile from the rack.
   * @param {string} tile - The tile to remove.
   * @returns {boolean} True if the tile was successfully removed, false
   * otherwise.
   */
  removeTile(tile) {
    if (!(tile in this.available)) {
      return false;
    } else {
      if (this.available[tile] === 1) {
        delete this.available[tile];
      } else {
        --this.available[tile];
      }

      // Update the total count of tiles on the rack.
      this.count--;

      const store = Store.store();
      store.set("rack", this.available);

      return true;
    }
  }

  /**
   * Takes tiles from the game bag and adds them to the available tiles on the
   * rack.
   * @param {number} n - The number of tiles to take from the bag.
   * @param {Object} game - The game instance from which to take tiles.
   */
  takeFromBag(n, game) {
    if (this.count === 7) {
      return;
    }

    for (let tile of game.takeFromBag(n)) {
      if (tile in this.available) {
        ++this.available[tile];
      } else {
        this.available[tile] = 1;
      }
    }
    const store = Store.store();
    store.set("rack", this.available);
  }

  /**
   * Resets the rack to its initial state.
   */
  reset() {
    this.available = {};
    this.count = 0;
    const store = Store.store();
    store.remove("rack");
  }
}
