import PouchDB from "pouchdb";

export const cardsDB = new PouchDB("cards");
export const collectionDB = new PouchDB("collection");
export const decksDB = new PouchDB("decks");
