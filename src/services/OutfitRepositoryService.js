import { Events } from '../eventhub/Events.js';
import Service from './Service.js';

export class OutfitRepositoryService extends Service {
  constructor() {
    super();
    this.dbName = 'outfitDB';
    this.storeName = 'outfit';
    this.db = null;

    // Initialize the database
    this.initDB()
      .then(() => {
        this.loadOutfitFromDB(); // Load outfit on initialization
      })
      .catch(error => {
        console.error(error);
      });
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = event => {
        const db = event.target.result;
        db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });
      };

      request.onsuccess = event => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = event => {
        reject('Error initializing IndexedDB');
      };
    });
  }

  async storeOutfit(OutfitData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(OutfitData);

      request.onsuccess = () => {
        this.publish(Events.StoreOutfitSuccess, OutfitData);
        resolve('Outfit stored successfully');
      };

      request.onerror = () => {
        this.publish(Events.StoreOutfitFailure, OutfitData);
        reject('Error storing outfit: ');
      };
    });
  }

  async loadOutfitFromDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = event => {
        const outfit = event.target.result;
        outfit.forEach(outfit => this.publish(Events.NewOutfit, outfit));
        resolve(outfit);
      };

      request.onerror = () => {
        this.publish(Events.LoadOutfitFailure);
        reject('Error retrieving outfit');
      };
    });
  }

  async clearOutfit() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        this.publish(Events.UnStoreOutfitSuccess);
        resolve('All outfit cleared');
      };

      request.onerror = () => {
        this.publish(Events.UnStoreOutfitFailure);
        reject('Error clearing outfit');
      };
    });
  }

  addSubscriptions() {
    this.subscribe(Events.StoreOutfit, data => {
      this.storeOutfit(data);
    });

    this.subscribe(Events.UnStoreOutfit, () => {
      this.clearOutfit();
    });
  }
}
