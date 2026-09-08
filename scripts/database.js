console.log('database.js loaded');


// Инициализация бд через Promise для асинхронной реализации

const dbPromise = new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('students-db', 1)


    openRequest.onupgradeneeded = function() {

        let db = openRequest.result;
        let store = db.createObjectStore('students', {
            keyPath: 'id',
            autoIncrement: true
        });

        store.createIndex('isuId', 'isuId', { unique: true });
    };

    openRequest.onerror = function() {
        reject(openRequest.error);
    };

    openRequest.onsuccess = function() {
        resolve(openRequest.result);
    }
});

export async function getAllStudents() {
    let db = await dbPromise;

    return new Promise((resolve, reject) => {
        let transaction = db.transaction('students', 'readonly');
        let store = transaction.objectStore('students');

        let getAllRequest = store.getAll();

        getAllRequest.onsuccess = function() {
            resolve(getAllRequest.result)
        }

        getAllRequest.onerror = function() {
            reject(getAllRequest.error)
        }
    });
};

export async function getStudentByDbId(id) {
    let db = await dbPromise;

    return new Promise((resolve, reject) => {
        let transaction = db.transaction('students', 'readonly');
        let store = transaction.objectStore('students');

        let getStudentRequest = store.get(Number(id));

        getStudentRequest.onsuccess = function() {
            resolve(getStudentRequest.result)
        }

        getStudentRequest.onerror = function() {
            reject(getStudentRequest.error)
        }
    });
};

export async function getStudentByIsuId(isuId) {
    let db = await dbPromise;

    return new Promise((resolve, reject) => {
        let transaction = db.transaction('students', 'readonly');
        let store = transaction.objectStore('students');

        let getStudentRequest = store.index("isuId").get(isuId);

        getStudentRequest.onsuccess = function() {
            resolve(getStudentRequest.result)
        }

        getStudentRequest.onerror = function() {
            reject(getStudentRequest.error)
        }
    });
};

 export async function deleteStudent(id) {
    let db = await dbPromise;

    return new Promise((resolve, reject) => {
        let transaction = db.transaction('students', 'readwrite');
        let store = transaction.objectStore('students');

        store.delete(Number(id))

        transaction.oncomplete = function() {
            resolve()
        };

        transaction.onabort = function() {
            reject(transaction.error)
        };
    });
 };

 export async function addStudent(student) {
    let db = await dbPromise;

    return new Promise((resolve, reject) => {
        let transaction = db.transaction('students', 'readwrite');
        let store = transaction.objectStore('students');

        store.add(student);

        transaction.oncomplete = function() {
            resolve()
        };

        transaction.onabort = function() {
            reject(transaction.error)
        };

    });
 };
