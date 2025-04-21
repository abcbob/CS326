/**
 * Represents a singleton store for managing local storage operations.
 * This class provides methods to interact with the browser's localStorage,
 * allowing items to be set, retrieved, and checked for existence.
 */
export class Store {
  /**
   * The singleton instance of the Store.
   * @private
   * @type {Store|null}
   */
  static #instance = null;

  /**
   * Retrieves the singleton instance of the Store. If it doesn't exist, creates it.
   * @returns {Store} The singleton instance of the Store.
   */
  static store() {
    if (Store.#instance === null) {
      Store.#instance = new Store();
    }

    return Store.#instance;
  }

  /**
   * Checks if the given key exists in localStorage.
   * @param {string} key The key to check in localStorage.
   * @returns {boolean} True if the key exists, false otherwise.
   */
  has(key) {
    return window.localStorage.getItem(key) !== null;
  }

  /**
   * Retrieves the value associated with the given key from localStorage.
   * @param {string} key The key for which to retrieve the value.
   * @returns {any} The value associated with the key, or null if the key does not exist.
   */
  get(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  /**
   * Sets a value in localStorage for the given key.
   * @param {string} key The key under which to store the value.
   * @param {any} value The value to store.
   */
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Removes the given key from localStorage.
   * @param {string} key The key to remove from localStorage.
   */
  remove(key) {
    window.localStorage.removeItem(key);
  }
}
