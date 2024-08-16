import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../firebaseconfig';

function TaskForm() {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "tasks"), {
                title,
                dueDate,
                description,
                status: 'pending'
            });

            setTitle('');
            setDueDate('');
            setDescription('');
        } catch (err) {
            console.error("Error adding task: ", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                required
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
            />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default TaskForm;
