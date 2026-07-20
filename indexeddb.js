const DB_NAME = "OpenPageCMS";
const DB_VERSION = 1;
const STORE = "posts";

let db;

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function (e) {
    db = e.target.result;

    if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, {
            keyPath: "id",
            autoIncrement: true
        });
    }
};

request.onsuccess = function (e) {
    db = e.target.result;
    console.log("IndexedDB Ready");
};

request.onerror = function () {
    console.log("Database Error");
};

function saveOffline(data) {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(data);
}

function getOffline(callback) {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();

    req.onsuccess = () => callback(req.result);
}