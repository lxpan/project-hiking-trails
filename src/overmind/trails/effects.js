// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, getDocs, setDoc, deleteDoc,
} from 'firebase/firestore/lite';
import firebaseConfig from '../firebaseConfig';
import seedTrails from './seed';
import geoRoutes from '../../utils/geoJsonUtils';

// currently serves as a mock for the backend
export const api = (() => ({
    initialize() {},
    loadRoutes() {
        return geoRoutes;
    },
}))();

// Use IIFE to hide outer private variables
export const _api = (() => {
    let app;
    let db;
    const trailsCollection = 'trails';
    return {
        initialize() {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
        },
        // queries Firestore for trail data
        async nodeQuery() {
            const trailsObj = {};
            const _collection = collection(db, 'trails');
            const snapshot = await getDocs(_collection);

            snapshot.forEach((_doc) => {
                const { name, id } = _doc.data();
                const trail = {
                    [_doc.id]: { name, id },
                };
                Object.assign(trailsObj, trail);
            });

            return trailsObj;
        },
        async mockQuery() {
            return seedTrails;
        },
        // writes a single document to the collection
        async writeDocument(documentName, documentJSON) {
            // Add new project entry to the Firebase database.
            try {
                let json;
                if (typeof documentJSON === 'string') {
                    json = JSON.parse(documentJSON);
                }
                else {
                    json = documentJSON;
                }

                await setDoc(doc(db, trailsCollection, documentName), {
                    ...json,
                });
            }
            catch (error) {
                console.error('Error writing new project to Firebase Database', error);
            }
        },
        // delete all documents from 'trails' individually
        async wipeTrails() {
            const _collection = collection(db, 'trails');
            const snapshot = await getDocs(_collection);

            snapshot.docs.forEach((_doc) => {
                deleteDoc(doc(_collection, _doc.id));
            });
        },
        // uploads our seed trail objects from seed.js
        migrateTrails() {
            seedTrails.forEach((trail) => {
                this.writeDocument(trail.id, trail);
            });
        },
    };
})();
