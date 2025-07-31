import React, { useState, useEffect } from 'react';
import './completed-task.css';

const CompletedTask = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCompletedTasks = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:3001/task');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const allTasks = await response.json();
            // Filter only completed tasks
            const completed = allTasks.filter(task => task.completed === true);
            setCompletedTasks(completed);
        } catch (err) {
            console.error('Error fetching completed tasks:', err);
            setError('Failed to load completed tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleCompleted = async (taskId, currentCompleted) => {
        try {
            const response = await fetch('http://localhost:3001/task', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: taskId,
                    completed: !currentCompleted
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh the completed tasks list
            fetchCompletedTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task. Please try again.');
        }
    };

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="completed-task-container">
                <h2>Completed Tasks</h2>
                <div className="loading-message">Loading completed tasks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="completed-task-container">
                <h2>Completed Tasks</h2>
                <div className="error-message">{error}</div>
                <button onClick={fetchCompletedTasks} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="completed-task-container">
            <h2>Completed Tasks</h2>
            
            {completedTasks.length === 0 ? (
                <div className="no-completed-tasks-message">
                    No completed tasks found. Complete some tasks to see them here!
                </div>
            ) : (
                <div className="completed-tasks-grid">
                    {completedTasks.map((task) => (
                        <div key={task.id} className="completed-task-card">
                            <div className="completed-task-header">
                                <div className="completed-task-header-left">
                                    <span className="completed-task-id">#{task.id}</span>
                                    <span className="completion-status completed">
                                        ✓ Completed
                                    </span>
                                </div>
                                <span className="completed-task-time">{formatDate(task.time)}</span>
                            </div>
                            
                            <div className="completed-task-content">
                                <div className="completed-task-field">
                                    <strong>Identity:</strong> {task.identity}
                                </div>
                                <div className="completed-task-field">
                                    <strong>Problem:</strong> {task.problem}
                                </div>
                                <div className="completed-task-field">
                                    <strong>Action:</strong> {task.action}
                                </div>
                                <div className="completed-task-field">
                                    <strong>Result:</strong> {task.result}
                                </div>
                            </div>

                            <div className="completed-task-actions">
                                <button 
                                    onClick={() => toggleCompleted(task.id, task.completed)}
                                    className="toggle-completed-btn completed"
                                >
                                    Mark as Pending
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button onClick={fetchCompletedTasks} className="refresh-button">
                Refresh Completed Tasks
            </button>
        </div>
    );
};

export default CompletedTask;

