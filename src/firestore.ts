import { Todo } from "./types.ts"
import { FirebaseApp, initializeApp } from '../node_modules/firebase/app';
import { Firestore, getFirestore, collection, doc, addDoc, getDocs, setDoc, deleteDoc } from "../node_modules/firebase/firestore/lite";
import { query, DocumentReference, DocumentData, Query, QuerySnapshot, QueryDocumentSnapshot } from "../node_modules/firebase/firestore/lite"; 
import { orderBy, startAfter, limit } from "../node_modules/firebase/firestore/lite"; 
import { Auth, getAuth } from "../node_modules/firebase/auth";

let pagePosition: QuerySnapshot<DocumentData, DocumentData>;

// Firebase project configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "todo-list-64101.firebaseapp.com",
    projectId: "todo-list-64101",
    storageBucket: "todo-list-64101.firebasestorage.app",
    messagingSenderId: "708703569768",
    appId: "1:708703569768:web:84f83f52c173235241b8dd"
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);


export async function createTodoFirestore(uid: string): Promise<Todo|null> {
    // Add a new document with a generated id.
    const todo:Todo = {id:'', timestamp:0, text:'', done:false};
    try {
        const docRef: DocumentReference<DocumentData,DocumentData> = await addDoc(collection(db, 'users', uid, 'todos'), todo);
        todo.id = docRef.id;
        todo.timestamp = Date.now();
        return todo;
    } catch (error) {
        console.error("Error", error);
        return null;
    }
}

export async function readTodosFirestore(uid: string): Promise<Todo[]> {
    // Get a list of todos from your database
    try {
        const todosQuery: Query<DocumentData,DocumentData> = query(collection(db, 'users', uid, 'todos'), orderBy("timestamp", "desc"));
        const querySnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(todosQuery);
        if(!querySnapshot.empty) {
            return querySnapshot.docs.map(doc => doc.data() as Todo);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error", error);
        return [];
    }
}

export async function readPageTodoFirestore(uid: string, first: boolean, size: number): Promise<Todo[]> {
    // Get a page of todos from your database
    try {
        if(first) {
            // Query the first page of docs
            const first: Query<DocumentData,DocumentData> = query(collection(db, 'users', uid, 'todos'), orderBy("timestamp", "desc"));
            pagePosition = await getDocs(first);
            return pagePosition.docs.map(doc => doc.data() as Todo);
        }
        else {
            // Get the last visible document
            const lastVisible: QueryDocumentSnapshot<DocumentData, DocumentData> = pagePosition.docs[pagePosition.docs.length-1];

            // Construct a new query starting at the last visible document, get the next todos.
            const next: Query<DocumentData,DocumentData> = query(collection(db, 'users', uid, 'todos'),
                orderBy("timestamp", "desc"),
                startAfter(lastVisible),
                limit(size));
            pagePosition = await getDocs(next);
            return pagePosition.docs.map(doc => doc.data() as Todo);
        }
    } catch (error) {
        console.error("Error", error);
        return [];
    }
}

export async function updateTodoFirestore(uid: string, todo:Todo): Promise<void> {
    // Add or update a document in collection "todos"
    try {
        const todoRef: DocumentReference<DocumentData,DocumentData> = doc(db, 'users', uid, 'todos', todo.id);
        await setDoc(todoRef, todo);
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteTodoFirestore(uid: string, todo:Todo): Promise<void> {
    // Delete a todo in your database
    try {
        const docRef: DocumentReference<DocumentData,DocumentData> = doc(db, 'users', uid, 'todos', todo.id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteTodosFirestore(uid: string, todos:Todo[]): Promise<void> {
    // Delete a todo in your database
    try {
        for(const todo of todos) {
            await deleteTodoFirestore(uid, todo);
        }
    } catch (error) {
        console.error("Error", error);
    }
}
