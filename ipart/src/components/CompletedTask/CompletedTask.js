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
            console.log('All tasks fetched:', allTasks);
            
            // Filter only completed, non-archived tasks
            const completed = allTasks.filter(task => task.completed === true && !task.archived);
            console.log('Filtered completed tasks:', completed);
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
            const task = completedTasks.find(t => t.id === taskId);
            if (!task) return;

            const response = await fetch('http://localhost:3001/task', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...task,
                    completed: !currentCompleted
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh the completed tasks list to reflect the changes
            await fetchCompletedTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task. Please try again.');
        }
    };

    const archiveTask = async (taskId) => {
        try {
            console.log('Archiving task with ID:', taskId);
            const task = completedTasks.find(t => t.id === taskId);
            if (!task) {
                console.error('Task not found for archiving');
                return;
            }

            console.log('Task to archive:', task);

            const response = await fetch('http://localhost:3001/task', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...task,
                    archived: true
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedTask = await response.json();
            console.log('Task archived successfully:', updatedTask);

            // Refresh the completed tasks list to reflect the changes
            await fetchCompletedTasks();
        } catch (err) {
            console.error('Error archiving task:', err);
            setError('Failed to archive task. Please try again.');
        }
    };

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTimeSpent = (hours) => {
        if (hours === 0) return '0h';
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
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
                                <span className="completed-task-date">{formatDate(task.date)}</span>
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
                                <div className="completed-task-field">
                                    <strong>Time Spent:</strong> {formatTimeSpent(task.timeSpent)}
                                </div>
                            </div>

                            <div className="completed-task-actions">
                                <button 
                                    onClick={() => toggleCompleted(task.id, task.completed)}
                                    className="toggle-completed-btn completed"
                                >
                                    Mark as Pending
                                </button>
                                <button 
                                    onClick={() => archiveTask(task.id)}
                                    className="archive-btn"
                                >
                                    Archive
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

