import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebaseconfig';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [sortOrder, setSortOrder] = useState('dueDate'); // Default sorting by dueDate
    const [filter, setFilter] = useState('all'); // Default filter to show all tasks

    useEffect(() => {
        const q = query(collection(db, "tasks"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let tasksData = [];
            querySnapshot.forEach((doc) => {
                tasksData.push({ ...doc.data(), id: doc.id });
            });

            // Filter tasks based on the selected filter
            if (filter === 'completed') {
                tasksData = tasksData.filter(task => task.status === 'completed');
            } else if (filter === 'pending') {
                tasksData = tasksData.filter(task => task.status === 'pending');
            }

            // Sort tasks based on the selected sort order
            tasksData.sort((a, b) => {
                if (sortOrder === 'dueDate') {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else {
                    return a.title.localeCompare(b.title);
                }
            });

            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, [sortOrder, filter]);

    const markAsCompleted = async (task) => {
        if (task.status !== 'completed') {
            try {
                const taskDocRef = doc(db, "tasks", task.id);
                await updateDoc(taskDocRef, { status: 'completed' });
                setTasks(prevTasks => prevTasks.map(t => 
                    t.id === task.id ? { ...t, status: 'completed' } : t
                ));
            } catch (err) {
                console.error('Error marking task as completed: ', err);
            }
        }
    };

    const deleteTask = async (id) => {
        try {
            const taskDocRef = doc(db, "tasks", id);
            await deleteDoc(taskDocRef);
            setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting task: ', err);
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div className="task-list">
            <div className="filters">
                <select onChange={handleSortChange} value={sortOrder}>
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="title">Sort by Title</option>
                </select>
                <select onChange={handleFilterChange} value={filter}>
                    <option value="all">Show All</option>
                    <option value="completed">Show Completed</option>
                    <option value="pending">Show Pending</option>
                </select>
            </div>
            {tasks.map((task) => (
                <div key={task.id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
                    <h3>{task.title}</h3>
                    <p>Due: {task.dueDate}</p>
                    <p>{task.description}</p>
                    <button onClick={() => markAsCompleted(task)}>Mark as Completed</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default TaskList;
