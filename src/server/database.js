import PouchDB from "pouchdb";

/**
 * Initializes a PouchDB database with specified collections if they do not
 * exist.
 *
 * This function creates a new PouchDB instance with the given database name. It
 * attempts to retrieve collections for 'words' and 'games'. If these
 * collections do not exist, it creates them with initial empty arrays.
 *
 * @param {string} dbname - The name of the database to initialize.
 */
const initdb = async (dbname) => {
  // Initialize the database if it doesn't exist
  const db = new PouchDB(dbname);

  // Get the words collection. If it doesn't exist, create it.
  try {
    const words = await db.get("words");
  } catch (e) {
    await db.put({ _id: "words", words: [] });
  }

  // Get the games collection. If it doesn't exist, create it.
  try {
    const games = await db.get("games");
  } catch (e) {
    await db.put({ _id: "games", games: [] });
  }

  // Close the database connection
  await db.close();
};

/**
 * Factory function to create a database instance using PouchDB for managing
 * word and game scores.
 *
 * This function initializes a database with the given name if it does not
 * already exist. It provides methods to save scores and retrieve top scores for
 * words and games. The database is re-instantiated with each method call to
 * ensure that the most recent data is used.
 *
 * @param {string} dbname - The name of the database to initialize and use.
 * @returns {object} An object containing methods to interact with the word and
 * game scores stored in the database.
 */
const Database = async (dbname) => {
  // Initialize the database
  await initdb(dbname);

  /**
   * Helper function to create a new PouchDB instance.
   * @returns {PouchDB} A new PouchDB instance connected to the specified
   * database.
   */
  const getDB = () => new PouchDB(dbname);

  const obj = {
    /**
     * Asynchronously saves a score for a specific word into the database. This
     * method handles database connection, data retrieval, data modification,
     * and error handling.
     *
     * @param {string} name - The name of the player for whom the score is being
     * saved.
     * @param {string} word - The word associated with the score.
     * @param {number} score - The score achieved for the given word.
     * @returns {Promise<object>} A promise that resolves to an object
     *                            indicating the result of the operation. If
     *                            successful, returns an object with `{ status:
     *                            'success' }`. If an error occurs, returns an
     *                            object with `{ status: 'error', message:
     *                            'Failed to save word score', error: <error
     *                            message> }`.
     */
    saveWordScore: async (name, word, score) => {
      try {
        const db = getDB();
        const data = await db.get("words");
        data.words.push({ name, word, score });
        await db.put(data);
        await db.close();
        return { status: "success" };
      } catch (e) {
        return {
          status: "error",
          message: "Failed to save word score",
          error: e.message,
        };
      }
    },

    /**
     * Asynchronously saves a game score to the database. This function manages
     * the process of connecting to the database, retrieving the game scores,
     * updating them, and saving the changes back to the database. It also
     * handles errors that might occur during the process.
     *
     * @param {string} name - The name of the player for whom the score is being
     * saved.
     * @param {number} score - The score achieved by the player in the game.
     * @returns {Promise<object>} A promise that resolves to an object
     *                            indicating the result of the operation. If
     *                            successful, returns an object with `{ status:
     *                            'success' }`. If an error occurs, returns an
     *                            object with `{ status: 'error', message:
     *                            'Failed to save game score', error: <error
     *                            message> }`.
     */
    saveGameScore: async (name, score) => {
      // TASK #7: Implement saveGameScore
      // Hint: You can use the saveWordScore method as a reference.
      // Hint: You will need to update the 'games' collection instead of the
      //       'words' collection.
      try {
        const db = getDB();
        let data = await db.get("games");
        data.games.push({ name, score });
        await db.put(data);
        await db.close();
        return { status: "success" };
      } catch (e) {
        return {
          status:"error",
          message:"Failed to save game score",
          error: e.message,
        };
      }
    },

    /**
     * Asynchronously retrieves the top 10 word scores from the database. This
     * function handles the process of connecting to the database, fetching the
     * words data, sorting the scores from highest to lowest, and returning the
     * top 10 entries.
     *
     * @returns {Promise<object>} A promise that resolves to an object
     *                            indicating the result of the operation. If
     *                            successful, returns an object with `{ status:
     *                            'success', data: Array }` where `data`
     *                            contains the top 10 scores as an array of
     *                            objects. If an error occurs, returns an object
     *                            with `{ status: 'error', message: 'Failed to
     *                            retrieve word scores', error: <error message>
     *                            }`.
     */
    top10WordScores: async () => {
      // TASK #8: Implement top10WordScores
      try {
        const db = getDB();
        const data = await db.get("words");
        const arr =data.words;
        arr= arr.sort((x,y)=> y.score -x.score).reverse().slice(0,10);
        await db.close();
        return { status: "success" ,data: arr};
      } catch (e) {
        return {
          status: "error",
          message: "Failed to retrieve word scores",
          error: e.message,
        };
      }
    },

    /**
     * Asynchronously retrieves the top 10 game scores from the database. This
     * method handles the full lifecycle of this operation, including database
     * connection, data retrieval, sorting the scores from highest to lowest,
     * and then slicing the top 10 scores for return.
     *
     * @returns {Promise<object>} A promise that resolves to an object
     *                            indicating the result of the operation. If
     *                            successful, it returns an object with `{
     *                            status: 'success', data: Array }`, where
     *                            `data` contains the top 10 game scores as an
     *                            array of objects. If an error occurs, it
     *                            returns an object with `{ status: 'error',
     *                            message: 'Failed to retrieve game scores',
     *                            error: <error message> }`.
     */
    top10GameScores: async () => {
      // TASK #9: Implement top10GameScores
      try {
        const db = getDB();
        const data = await db.get("games");
        const arr =data.games;
        arr= arr.sort((x,y)=> y.score - x.score).reverse().slice(0,10);
        await db.close();
        return { status: "success" ,data: arr};
      } catch (e) {
        return {
          status: "error",
          message: "Failed to retrieve game scores",
          error: e.message,
        };
      }
    },
  };

  return obj;
};

/**
 * Exports the Database factory function which sets up and manages a database
 * tailored for storing and retrieving game and word scores. This module
 * provides a set of operations including saving scores, fetching top scores,
 * and initializing necessary database structures.
 *
 * The exported Database function ensures each call initializes or connects to a
 * specific database instance identified by the given database name.
 *
 * @module Database
 * @function
 * @param {string} dbname - The name of the database for which the instance is
 * created and managed.
 * @returns {Object} An object containing methods for database operations like
 * saving scores and retrieving top scores.
 */
export default Database;
