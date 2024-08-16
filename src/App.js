import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseconfig';
import TaskList from './components/tasklist';
import TaskForm from './components/taskform';
import './app.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Task Manager</h1>
                {user ? (
                    <div>
                        <p>Welcome, {user.displayName || 'User'}</p>
                        <TaskForm />
                        <TaskList />
                    </div>
                ) : (
                    <div>
                        <p>Please log in to manage your tasks.</p>
                        <button onClick={signIn}>Sign In with Google</button>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
