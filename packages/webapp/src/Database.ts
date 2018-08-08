import * as RxDB from "rxdb";

import * as idb from "pouchdb-adapter-idb";
import { RxCollection, RxDatabase, RxDocument } from "rxdb";
const { QueryChangeDetector } = RxDB;

QueryChangeDetector.enable();
QueryChangeDetector.enableDebugging();

RxDB.plugin(idb);

declare interface RxHeroDocumentType {
  name?: string;
  color?: string;
  maxHP?: number;
  hp?: number;
  team?: string;
  skills?: Array<{
    name?: string;
    damage?: string;
  }>;
}

// ORM methods

export type RxHeroDocument = RxDocument<RxHeroDocumentType>;

declare interface RxHeroCollection extends RxCollection<RxHeroDocumentType> {
  pouch: any;
}

declare interface RxHeroesDatabase extends RxDatabase {
  heroes?: RxHeroCollection;
}

const collections = [
  {
    methods: {
      hpPercent(): number {
        return 100;
      }
    },
    name: "heroes",
    schema: require("./Schema.js").default,
    sync: true
  }
];

let dbPromise: Promise<RxHeroesDatabase> | null = null;

const create = async () => {
  console.log("DatabaseService: creating database..");
  const db = await RxDB.create({
    adapter: "idb",
    name: "heroesreactdb",
    password: "myLongAndStupidPassword"
  });
  console.log("DatabaseService: created database");

  // tslint:disable
  (<any>window).db = db; // write to window for debugging
  // tslint:enable

  // show leadership in title
  db.waitForLeadership().then(() => {
    console.log("isLeader now");
    document.title = "♛ " + document.title;
  });

  // create collections
  console.log("DatabaseService: create collections");
  await Promise.all(collections.map(colData => db.collection(colData)));

  // hooks
  console.log("DatabaseService: add hooks");
  db.collections.heroes.preInsert(
    (docObj: any): RxDatabase => {
      const color = docObj.color;
      return db.collections.heroes
        .findOne({ color })
        .exec()
        .then(
          (has: boolean): RxHeroesDatabase => {
            if (has != null) {
              alert("another hero already has the color " + color);
              throw new Error("color already there");
            }
            return db;
          }
        );
    }
  );

  return db;
};

export function get(): Promise<RxHeroesDatabase> {
  if (!dbPromise) {
    dbPromise = create();
  }
  return dbPromise;
}
